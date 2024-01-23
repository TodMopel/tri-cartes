import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from './../components/Card';
import CardPile from './../components/CardPile';
import Category from './../components/Category';
import CardDiscard from './../components/CardDiscard';
import InfoPanel from './../components/InfoPanel';
import './../App.css';

import config from './../data/config';

const GamePage = ({ jobListData, onResultSubmit }) => {

    const [gameData, setGameData] = useState({
        jobList: [],
        cardList: [],
        discardedCardsList: [],
        categoryList: [],
        infoPanelCard: null,
        selectedCardIndex: null,
        lastSelectedCardIndex: null,
        cardMoving: false,
        selectedCategoryIndex: null,
        lastSelectedCategoryIndex: null,
        categoryMoving: false,
    });
    const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
    const [zIndexOrder, setZIndexOrder] = useState(1);

    const pilePosition = ({ x: window.innerWidth / 2 - 55, y: window.innerHeight / 2 - 40 });
    const discardPosition = ({ x: 110, y: 80 });
    const infoPanelPosition = ({ x: 110, y: window.innerHeight - 280 });
    const newCategoryPosition = ({ x: window.innerWidth / 2 - config.category.size.x / 2, y: 80 });

    useEffect(() => {
        setGameData(prevGameData => ({
            ...prevGameData,
            jobList: jobListData || [],
        }));
    }, [jobListData]);

    //useEffect(() => {
    //    if (gameData.jobList.length <= 0) {
    //        fetchJobList();
    //    }
    //}, []);

    //const fetchJobList = () => {
    //    const jobListString = JSON.stringify(jobListData);
    //    const jobListObject = JSON.parse(jobListString);

    //    setGameData((prevGameData) => ({
    //        ...prevGameData,
    //        jobList: Object.entries(jobListObject).map(([text, description]) => ({ text, description })),
    //    }));
    //};



    const handleCardDropOnDroppable = (item) => {
        const droppedCard = gameData.cardList[gameData.lastSelectedCardIndex];

        //console.log(`Card ${droppedCard.text} dropped inside : ${item} `);

        droppedCard.isActive = false;
        if (item === "Discard") {
            setGameData((prevGameData) => ({
                ...prevGameData,
                discardedCardsList: [...prevGameData.discardedCardsList, droppedCard],
            }));
        } else if (item === "InfoPanel") {
            setGameData((prevGameData) => ({
                ...prevGameData,
                infoPanelCard: droppedCard,
            }));
        } else { // c'est une categorie
            const updatedCategoryList = gameData.categoryList.map((category) => {
                if (category.text === item) {
                    const updatedcategoryCardList = category.categoryCardList ? [...category.categoryCardList, droppedCard] : [droppedCard];

                    return {
                        ...category,
                        categoryCardList: updatedcategoryCardList,
                    };
                }
                return category;
            });

            setGameData((prevGameData) => ({
                ...prevGameData,
                categoryList: updatedCategoryList,
            }));
        }
    }

    const handleCategoryDropOnDroppable = (item) => {
        const droppedCategory = gameData.categoryList[gameData.lastSelectedCategoryIndex];

        console.log(`Category ${droppedCategory.text} dropped inside : ${item} `);
        droppedCategory.isActive = false;
        if (item === "Discard") {
            handleDeleteCategory(droppedCategory);
        }
    }

    const handleAddCard = (pilePosition) => {
        const { jobList } = gameData;

        if (jobList.length === 0) return;

        const randomIndex = Math.floor(Math.random() * jobList.length);
        const selectedJob = jobList[randomIndex];

        const cardWidth = config.card.size.x;
        const newCard = {
            position: { x: pilePosition.x - cardWidth / 2, y: pilePosition.y - 80 },
            text: selectedJob.text,
            description: selectedJob.description,
            isActive: true,
            zIndex: zIndexOrder,
        };

        const updatedJobList = jobList.filter((_, index) => index !== randomIndex);

        setGameData((prevGameData) => ({
            ...prevGameData,
            cardList: [...prevGameData.cardList, newCard],
            jobList: updatedJobList,
        }));
    };

    const handleRestoreDiscardedCard = (discardPosition) => {
        const { discardedCardsList } = gameData;

        if (discardedCardsList.length === 0) return;

        const cardWidth = config.card.size.x;
        const newCard = {
            position: { x: discardPosition.x - cardWidth / 2, y: discardPosition.y - 80 },
            text: discardedCardsList[discardedCardsList.length - 1].text,
            description: discardedCardsList[discardedCardsList.length - 1].description,
            isActive: true,
            zIndex: zIndexOrder,
        };
        const updatedDiscardedCardsList = discardedCardsList.filter((_, index) => index !== discardedCardsList.length - 1);

        setGameData((prevGameData) => ({
            ...prevGameData,
            cardList: [...prevGameData.cardList, newCard],
            discardedCardsList: updatedDiscardedCardsList,
        }));
    }

    const handleRestoreCategorizedCard = (position, categoryIndex, cardIndex) => {
        const updatedCategoryList = [...gameData.categoryList];
        const updatedCardList = [...gameData.cardList];

        const selectedCategory = updatedCategoryList[categoryIndex];
        const restoredCard = selectedCategory.categoryCardList[cardIndex];

        selectedCategory.categoryCardList.splice(cardIndex, 1);

        const cardWidth = config.card.size.x;
        const newCard = {
            position: { x: position.x - cardWidth / 2, y: position.y - 80 },
            text: restoredCard.text,
            description: restoredCard.description,
            isActive: true,
            zIndex: zIndexOrder,
        };

        updatedCardList.push(newCard);

        setGameData((prevGameData) => ({
            ...prevGameData,
            categoryList: updatedCategoryList,
            cardList: updatedCardList,
        }));
    }
    const handleRestoreInfoPanelCard = (position, card) => {
        const updatedCardList = [...gameData.cardList];

        const cardWidth = config.card.size.x;
        const newCard = {
            position: { x: position.x, y: position.y },
            text: card.text,
            description: card.description,
            isActive: true,
            zIndex: zIndexOrder,
        };

        updatedCardList.push(newCard);

        setGameData((prevGameData) => ({
            ...prevGameData,
            cardList: updatedCardList,
            infoPanelCard: null,
        }));
    }

    const handleAddCategory = () => {
        const { categoryList } = gameData;

        const newCategory = {
            position: { x: newCategoryPosition.x, y: newCategoryPosition.y },
            text: config.category.baseTitle + " " +(categoryList.length + 1),

            categoryCardList: [],
            isActive: true,

            zIndex: zIndexOrder,
        }

        setGameData((prevGameData) => ({
            ...prevGameData,
            categoryList: [...prevGameData.categoryList, newCategory],
        }));
    }

    const handleDeleteCategory = (droppedCategory) => {
        const droppedCardList = droppedCategory.categoryCardList;
        console.log(droppedCardList);
        if (droppedCardList.length > 0) {
            setGameData((prevGameData) => ({
                ...prevGameData,
                discardedCardsList: [...prevGameData.discardedCardsList, ...droppedCardList],
            }));
        }
    }

    const handleDragStart = (cardIndex, categoryIndex) => {
        if (cardIndex != null) {
            setZIndexOrder(prevZIndexOrder => prevZIndexOrder + 1);

            setGameData((prevGameData) => {
                const updatedCardList = [...prevGameData.cardList];
                updatedCardList[cardIndex] = {
                    ...updatedCardList[cardIndex],
                    zIndex: zIndexOrder,
                };

                return {
                    ...prevGameData,
                    selectedCardIndex: cardIndex,
                    cardMoving: true,
                    cardList: updatedCardList,
                };
            });
        }
        if (categoryIndex != null) {
            setZIndexOrder(prevZIndexOrder => prevZIndexOrder + 1);

            setGameData((prevGameData) => {
                const updatedCategoryList = [...prevGameData.categoryList];
                updatedCategoryList[categoryIndex] = {
                    ...updatedCategoryList[categoryIndex],
                    zIndex: zIndexOrder,
                };

                return {
                    ...prevGameData,
                    selectedCategoryIndex: categoryIndex,
                    categoryMoving: true,
                    categoryList: updatedCategoryList,
                };
            });
        }
    };

    const handleDragEnd = (cardIndex, categoryIndex) => {
        if (cardIndex != null) {
            setGameData((prevGameData) => ({
                ...prevGameData,
                lastSelectedCardIndex: prevGameData.selectedCardIndex,
                selectedCardIndex: null,
                cardMoving: false,
            }));
        }
        if (categoryIndex != null) {
            setGameData((prevGameData) => ({
                ...prevGameData,
                lastSelectedCategoryIndex: prevGameData.selectedCategoryIndex,
                selectedCategoryIndex: null,
                categoryMoving: false,
            }));
        }
    };

    const handleMouseMove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        setMouseCoordinates({ x: mouseX, y: mouseY });
    };
    const handleTouchMove = (e) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        setMouseCoordinates({ x: touchX, y: touchY });
    };

    const updateCategoryText = (categoryIndex, newText) => {
        setGameData((prevGameData) => {
            const updatedCategoryList = [...prevGameData.categoryList];
            updatedCategoryList[categoryIndex] = {
                ...updatedCategoryList[categoryIndex],
                text: newText,
            };
            return {
                ...prevGameData,
                categoryList: updatedCategoryList,
            };
        });
    };

    const generateResultTable = () => {
        const resultTable = gameData.categoryList.map((category) => {
            return {
                categoryName: category.text,
                jobs: category.categoryCardList.map((card) => card.text),
            };
        });
        onResultSubmit(resultTable);
    };
    return (
        <div
            className="unselectable game-page background-grid"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {gameData.jobList.length > -1 && (
                <CardPile
                    position={pilePosition}
                    elementRef={'CardPile'}
                    onDragStart={handleDragStart}

                    addCard={handleAddCard}
                    counter={gameData.jobList.length}
                />
            )}
            <CardDiscard
                position={discardPosition}

                onDragStart={handleDragStart}

                onCancel={handleRestoreDiscardedCard}
                discardedCardsList={gameData.discardedCardsList}

                cardMoving={gameData.cardMoving}
                categoryMoving={gameData.categoryMoving}
                mousePosition={mouseCoordinates}

                onCardDropInsideDropZone={handleCardDropOnDroppable}
                onCategoryDropInsideDropZone={handleCategoryDropOnDroppable}
            />
            <InfoPanel
                position={infoPanelPosition}

                onDragStart={handleDragStart}

                cardMoving={gameData.cardMoving}
                mousePosition={mouseCoordinates}

                onCardDropInsideDropZone={handleCardDropOnDroppable}
                droppedCard={gameData.infoPanelCard}

                onCardRestored={handleRestoreInfoPanelCard}
            />
            {gameData.categoryList.map((category, index) => (
                category.isActive && (

                <Category
                    key={index}
                    categoryIndex={index}
                    text={category.text}
                    updateCategoryText={(newText) => updateCategoryText(index, newText)}

                    position={category.position}
                    categoryCardList={category.categoryCardList}
                    zIndexOrder={category.zIndex}

                    onDragStart={() => handleDragStart(null, index)}
                    onDragEnd={() => handleDragEnd(null, index)}

                    cardMoving={gameData.cardMoving}
                    mousePosition={mouseCoordinates}

                    onCardDropInsideDropZone={handleCardDropOnDroppable}

                    onCardRestored={handleRestoreCategorizedCard}
                />)
            ))}
            {gameData.cardList.map((card, index) => (
                card.isActive && (
                    <Card
                        key={index}
                        text={card.text}
                        position={card.position}
                        zIndexOrder={card.zIndex}

                        onDragStart={() => handleDragStart(index, null)}
                        onDragEnd={() => handleDragEnd(index, null)}
                    />)
            ))}

            <div
                className="ui-button-container ui-add-category-button"
            >
                <div
                    className="button button-normal"
                    onClick={handleAddCategory}
                >
                    {config.category.createButtonText}
                </div>
            </div>
            {gameData.jobList.length === 0 && gameData.cardList.every((card) => !card.isActive && gameData.infoPanelCard === null) && (
                <div className="ui-button-container ui-end-game-button">
                    <Link
                        onClick={generateResultTable}
                        to="/tri-cartes/result"
                        className="button button-normal"
                    >
                        {config.result.endGameButton}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default GamePage;