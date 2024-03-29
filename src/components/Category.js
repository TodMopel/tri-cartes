import React, { useRef, useState, useEffect } from 'react';
import Draggable from './Draggable';
import Droppable from './Droppable';

import editLineIcon from './../images/edit_line.png';
import config from './../data/config';

const Category = ({ categoryIndex, position, text, updateCategoryText, onDragStart, onDragEnd, cardMoving, mousePosition, onCardDropInsideDropZone, categoryCardList, onCardRestored, zIndexOrder }) => {
    const categoryRef = useRef();
    const [thisSize, setThisSize] = useState(config.category.size);
    const [thisColor, setThisColor] = useState();
    const dropZoneRef = useRef();
    const dropZoneSize = config.card.size;

    const categoryNameRef = useRef();
    const [categoryNameHeight, setCategoryNameHeight] = useState(18);

    const [isDropZoneActive, setIsDropZoneActive] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);

    const [categoryName, setCategoryName] = useState(text);

    const handleCardEnter = () => {
        setIsDropZoneActive(true);
    };

    const handleCardLeave = () => {
        setIsDropZoneActive(false);
    };
    useEffect(() => {
        setThisColor(getRandomColor());
    }, []);

    useEffect(() => {
        if (isDropZoneActive) {
            onCardDropInsideDropZone(text);
            setIsDropZoneActive(false);
        }
    }, [cardMoving]);

    useEffect(() => {
        setThisSize((prevSize) => ({ ...prevSize, y: 120 + categoryCardList.length * 30 + categoryNameHeight }));
    }, [categoryCardList]);

    const handleRenameClick = () => {
        setIsRenaming(true);
    };

    const handleRenameChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleRenameBlur = () => {
        setCategoryName((prevName) => categoryName);
        setIsRenaming(false);

        setTimeout(() => {
            const inputHeight = categoryNameRef.current.getBoundingClientRect().height;
            setCategoryNameHeight(inputHeight);
            setThisSize((prevSize) => ({ ...prevSize, y: 120 + categoryCardList.length * 30 + inputHeight }));
            updateCategoryText(categoryName);
        }, 0);
    };

    const handleRenameKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleRenameBlur();
        }
    };

    const handleCategoryCardClick = (categoryIndex, index) => {
        const rect = categoryRef.current.getBoundingClientRect();
        const position = {
            x: rect.left + rect.width / 2,
            y: rect.top,
        };

        onCardRestored(position, categoryIndex, index);
        setThisSize((prevSize) => ({ ...prevSize, y: 120 + categoryCardList.length * 30 + categoryNameHeight }));
    }

    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * config.category.categoryColors.length);
        return config.category.categoryColors[randomIndex];
    };

    const getCategoryName = () => {
        return categoryName;
    }

    return (
        <Draggable
            initialPosition={position}
            size={thisSize}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            zIndexOrder={zIndexOrder}
        >
            <div
                ref={categoryRef}
                className="category-container"
                style={{
                    position: 'absolute',
                    width: thisSize.x,
                    height: thisSize.y,
                    left: position.x + 'px',
                    top: position.y + 'px',

                    borderColor: thisColor,
                }}
            >
                <div
                    ref={categoryNameRef}
                >
                    {isRenaming ? (
                        <input
                            type="text"
                            value={categoryName}
                            onChange={handleRenameChange}
                            onBlur={handleRenameBlur}
                            onKeyDown={handleRenameKeyDown}
                            autoFocus
                            className="category-title"
                            style={{
                                border: '0',
                                backgroundColor: 'transparent',
                                width: dropZoneSize.x,
                            }}
                        />
                    ) : (
                            <div
                                className="row-content category-title"
                            >
                                <div>
                                    {categoryName}
                                </div>
                                <img
                                    src={editLineIcon}
                                    alt="Renommer"
                                    className="rename-icon"
                                    onClick={handleRenameClick}
                                />
                            </div>
                        )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {categoryCardList.map((card, index) => (
                        <div
                            className="card-container card-categorized-container"
                            key={index}
                        >
                            <div
                                className="card card-txt card-categorized-txt"
                                onClick={() => handleCategoryCardClick(categoryIndex, index)}
                            >
                                {card.text}
                            </div>
                        </div>
                    ))}
                </div>
                <Droppable
                    cardMoving={cardMoving}
                    mousePosition={mousePosition}
                    onCardEnter={handleCardEnter}
                    onCardLeave={handleCardLeave}
                >
                        <div
                            ref={dropZoneRef}
                            className="drop-zone-default"
                            style={{
                                width: dropZoneSize.x,
                                height: dropZoneSize.y,
                                backgroundColor: !isDropZoneActive ? '#FFCA0080' : 'transparent',
                            }}
                        >
                        </div>
                </Droppable>
                {categoryCardList.length > 1 && (
                    <div className="card-categorized-counter">
                        {`${categoryCardList.length} ${config.category.infoCounter}`}
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default Category;
