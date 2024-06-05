import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from './../components/Card';
import CardPile from './../components/CardPile';
import Category from './../components/Category';
import CardDiscard from './../components/CardDiscard';
import InfoPanel from './../components/InfoPanel';
import './../App.css';
import html2canvas from 'html2canvas';

import config from './../data/config';

import ArrowIconL from './../images/ArrowL.png';
import ArrowIconR from './../images/ArrowR.png';

const GamePage = ({ jobListData, onResultSubmit, candidatName }) => {
    const [gameData, setGameData] = useState(loadGameState() || getDefaultGameData());
    
    const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
    const [zIndexOrder, setZIndexOrder] = useState(1);

    const pilePosition = ({ x: window.innerWidth / 2 - 55, y: window.innerHeight / 2 - 40 });
    const discardPosition = ({ x: 110, y: 80 });
    const infoPanelPosition = ({ x: 110, y: window.innerHeight - 280 });

    const gameContainerRef = useRef(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const tooltipRef = useRef(null);


    useEffect(() => {
        saveGameState(gameData);
    }, [gameData]);

    function getDefaultGameData() {
        return {
            candidatName : candidatName,
            jobList: jobListData,
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
        };
    }

    function saveGameState(gameState) {
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    function loadGameState() {
        const savedState = localStorage.getItem('gameState');
        console.log(savedState);
        return savedState ? JSON.parse(savedState) : null;
    }

    function clearGameState() {
        localStorage.removeItem('gameState');
    }

    const handleCardDropOnDroppable = (item) => {
        const droppedCard = gameData.cardList[gameData.lastSelectedCardIndex];

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
            canRename: false,
        };

        const updatedJobList = jobList.filter((_, index) => index !== randomIndex);

        setGameData((prevGameData) => ({
            ...prevGameData,
            cardList: [...prevGameData.cardList, newCard],
            jobList: updatedJobList,
        }));
    };

    const handleCreateCard = () => {
        const cardWidth = config.card.size.x;
        const rect = document.getElementById('AddCardButton').getBoundingClientRect();
        const newCardPosition = {
            x: rect.left + 50 + Math.random() * 70,
            y: rect.bottom + Math.random() * 50
        };

        const newCard = {
            position: { x: newCardPosition.x - cardWidth / 2 , y: newCardPosition.y },
            text: "Nouveau métier",
            description: `Carte crée par ${gameData.candidatName}.`,
            isActive: true,
            zIndex: zIndexOrder,
            canRename: true,
        };

        setGameData((prevGameData) => ({
            ...prevGameData,
            cardList: [...prevGameData.cardList, newCard],
        }));
    };

    const handleRenameCard = (index, newText) => {
        setGameData((prevGameData) => ({
            ...prevGameData,
            cardList: prevGameData.cardList.map((card, i) =>
                i === index ? { ...card, text: newText, canRename: true } : card
            ),
        }));
    };
    const handleRenameCardInputChange = (event, index) => {
        const newText = event.target.value;
        setGameData((prevGameData) => ({
            ...prevGameData,
            cardList: prevGameData.cardList.map((card, i) =>
                i === index ? { ...card, text: newText } : card
            ),
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
            canRename: discardedCardsList[discardedCardsList.length - 1].canRename,
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
            canRename: restoredCard.canRename,
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
            canRename: card.canRename,
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

        const rect = document.getElementById('AddCategoryButton').getBoundingClientRect();
        const newCategoryPosition = {
            x: rect.left + 20 + Math.random() * 70,
            y: rect.bottom + Math.random() * 50
        };

        const newCategory = {
            position: { x: newCategoryPosition.x + getRandomOffset() / 2, y: newCategoryPosition.y + getRandomOffset()},
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
    const getRandomOffset = () => {
        return Math.random() * 30;
    };

    const handleDeleteCategory = (droppedCategory) => {
        const droppedCardList = droppedCategory.categoryCardList;
        setGameData((prevGameData) => ({
            ...prevGameData,
            discardedCardsList: [...prevGameData.discardedCardsList, ...droppedCardList],
        }));
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
        const resultTable = gameData.categoryList
        .filter((category) => category.isActive)
        .map((category) => ({
            categoryName: category.text,
            jobs: category.categoryCardList.map((card) => ({
                text: card.text,
                isActive: true,
            })),
        }));
        clearGameState();
        onResultSubmit(resultTable);
    };

    const handleToolTip = () => {
        setTooltipOpen(prevPosition => !prevPosition);
    };
    useEffect(() => {
        handleToolTip();
    }, []);

    useEffect(() => {
        const tooltipContainer = tooltipRef.current;
        if (tooltipContainer) {
            const boundingRect = tooltipContainer.getBoundingClientRect();
            const dynamicPosition = boundingRect.width;

            tooltipContainer.style.transform = tooltipOpen 
                ? 'translate(0%, 0%)' 
                : `translate(${dynamicPosition}px, 0%)`;
        }
    }, [tooltipOpen]);

    const handleScreenShot = () => {
        const elementIdsToHide = ['CardPile', 'CardDiscard', 'AddCategoryButton', 'AddCardButton', 'ToolTip'];

        if (gameData.infoPanelCard == null) {
            elementIdsToHide.push('InfoPanel');
        }

        elementIdsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.visibility = 'hidden';
            }
        });

        html2canvas(gameContainerRef.current).then(canvas => {
            elementIdsToHide.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.visibility = 'visible';
                }
            });

            document.body.appendChild(canvas);
            
            const date = new Date().toISOString().slice(0, 10);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `SophieLuksenberg-Game_${date}_${gameData.candidatName}.png`;
            link.click();
        });
    }
    const handleFullScreen = () => {
        // toggle fullscreen
        if (!document.fullscreenElement) {
            if (gameContainerRef.current.requestFullscreen) {
                gameContainerRef.current.requestFullscreen();
            } else if (gameContainerRef.current.mozRequestFullScreen) { /* Firefox */
                gameContainerRef.current.mozRequestFullScreen();
            } else if (gameContainerRef.current.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                gameContainerRef.current.webkitRequestFullscreen();
            } else if (gameContainerRef.current.msRequestFullscreen) { /* IE/Edge */
                gameContainerRef.current.msRequestFullscreen();
            }
            gameContainerRef.current.style.backgroundColor = 'white';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
            gameContainerRef.current.style.backgroundColor = '';
        }
    }

    return (
        <div
            className="unselectable game-page background-grid"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            ref={gameContainerRef}
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
                        canRename={card.canRename}

                        onDragStart={() => handleDragStart(index, null)}
                        onDragEnd={() => handleDragEnd(index, null)}

                        onCardRename={(newText) => handleRenameCard(index, newText)}
                        onCardInputChange={(event) => handleRenameCardInputChange(event, index)}
                    />)
            ))}

            <div
                className='ui-menu-container'
            >
                <div
                    className="ui-button-container ui-add-category-button"
                    id="AddCategoryButton"
                >
                    <div
                        className="button button-normal"
                        onClick={handleAddCategory}
                    >
                        {config.category.createButtonText}
                    </div>
                </div>
                <div
                className="ui-button-container ui-add-card-button"
                    id="AddCardButton"
                >
                    <div
                        className="button button-small"
                        onClick={handleCreateCard}
                    >
                        {config.card.createButtonText}
                    </div>
                </div>
            </div>

            <div
                className="ui-button-container ui-tooltip-container"
                id="ToolTip"
                ref={tooltipRef}
            >
                <div
                    className="ui-tooltip-arrow"
                    onClick={handleToolTip}
                > 
                    <img src={tooltipOpen ? ArrowIconR : ArrowIconL} alt="Arrow" />
                </div>

                <div
                    className="button button-normal"
                    onClick={handleScreenShot}
                >
                    {config.tooltip.screenshotButtonText}
                </div>
                <div
                    className="button button-normal"
                    onClick={handleFullScreen}
                >
                    {config.tooltip.fullscreenButtonText}
                </div>
                <Link to="/">
                <div
                    className="button button-normal"
                >
                        {config.tooltip.quitButtonText}
                </div>
                    </Link>
            </div>
            
            {gameData.jobList.length === 0 && gameData.cardList.every((card) => !card.isActive && gameData.infoPanelCard === null) && (
                <div className="ui-button-container ui-end-game-button">
                    <Link
                        onClick={generateResultTable}
                        to="/result"
                        className="button button-normal"
                    >
                        {config.result.endGameButton}
                    </Link>
                </div>
            )}

            <div
                className="cartes-counter"
                >
                    Session de {gameData.candidatName}. {gameData.cardList.filter(card => card.isActive).length + (gameData.infoPanelCard ? 1 : 0)} cartes, {gameData.categoryList.filter(category => category.isActive).length} catégories
            </div>
        </div>
    );
};

export default GamePage;