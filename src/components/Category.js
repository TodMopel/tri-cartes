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

    const columnLimit = 10;
    const cardWidth = 120;

    const renderCategoryColumns = () => {
        const columns = [];
        const totalCards = categoryCardList.length;
    
        const totalColumns = Math.ceil(totalCards / columnLimit);
    
        for (let i = 0; i < totalColumns; i++) {
            const columnCards = categoryCardList.slice(i * columnLimit, (i + 1) * columnLimit);
            const columnContent = columnCards.map((card, index) => (
                <div
                    className="card-container card-categorized-container"
                    key={index}
                >
                    <div
                        className="card card-txt card-categorized-txt"
                        onClick={() => handleCategoryCardClick(categoryIndex, i * columnLimit + index)}
                    >
                        {card.text}
                    </div>
                </div>
            ));
    
            columns.push(
                <div className="category-column" key={i}>
                    {columnContent}
                </div>
            );
        }
        return (
            <div className="category-row" style={{ display: 'grid', gridTemplateColumns: `repeat(${totalColumns}, 1fr)` }}>
                {columns}
            </div>
        );
    };

    const calculateCategorySize = () => {
        const titleHeight = categoryNameRef.current.getBoundingClientRect().height;
        const totalCards = categoryCardList.length;
        
        if (totalCards === 0) {
            return { x: config.category.size.x, y: 120 + titleHeight };
        }
    
        const totalColumns = Math.ceil(totalCards / columnLimit);
        const totalRows = totalCards < columnLimit ?totalCards: columnLimit;
    
        const totalHeight = 120 + totalRows * 30 + titleHeight;
    
        const totalWidth = totalColumns * (cardWidth) + 20;
        return { x: totalWidth, y: totalHeight };
    };

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
        const newSize = calculateCategorySize();
        setThisSize(newSize);
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
            
            const newSize = calculateCategorySize();
            setThisSize(newSize);
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
        const newSize = calculateCategorySize();
        setThisSize(newSize);
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
                                    className="rename-icon-category"
                                    onClick={handleRenameClick}
                                />
                            </div>
                        )}
                </div>

                {renderCategoryColumns()}
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
