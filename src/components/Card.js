import React, { useState } from 'react';
import Draggable from './Draggable';

import editLineIcon from './../images/edit_line.png';
import config from './../data/config';

const Card = ({ text, position, onDragStart, onDragEnd, onDragMove, zIndexOrder, canRename, onCardRename, onCardInputChange }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [cardText, setCardText] = useState(text);
    const thisSize = config.card.size;
    const handleRenameClick = () => {
        setIsRenaming(true);
    };

    const handleRenameChange = (e) => {
        setCardText(e.target.value);
        onCardInputChange(e, e.target.value)
    };

    const handleRenameBlur = () => {
        setIsRenaming(false);
        onCardRename(cardText);
    };

    const handleRenameKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleRenameBlur();
        }
    };

    return (
        <Draggable
            initialPosition={position}
            size={thisSize}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragMove={onDragMove}
            zIndexOrder={zIndexOrder}
        >
            <div
                className="card-container card-draggable"
                style={{
                    position: 'absolute',
                    left: position.x + 'px',
                    top: position.y + 'px',
                    width: thisSize.x,
                    height: thisSize.y,
                }}
            >
                <div className="card card-txt">
                    {isRenaming ? (
                        <input
                            type="text"
                            value={cardText}
                            onChange={handleRenameChange}
                            onBlur={handleRenameBlur}
                            onKeyDown={handleRenameKeyDown}
                            autoFocus
                            className="card-title"
                        />
                    ) : (
                        <>
                            <div className="card-title">
                                {text}
                                {canRename && (
                                    <img
                                        src={editLineIcon}
                                        alt="Renommer"
                                        className="rename-icon-card"
                                        onClick={handleRenameClick}
                                    />
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Draggable>
    );
};

export default Card;
