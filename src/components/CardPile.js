import React, { useRef } from 'react';
import Draggable from './Draggable';

import config from './../data/config';

const CardPile = ({ position, onDragStart, addCard, counter, zIndexOrder }) => {
    const cardPileRef = useRef();
    const thisSize = config.pile.size;

    const handleAddCard = () => {
        const rect = cardPileRef.current.getBoundingClientRect();
        const pilePosition = {
            x: rect.left + rect.width / 2 + getRandomOffset(),
            y: rect.top + getRandomOffset(),
        };
        addCard(pilePosition);
    };
    
    const getRandomOffset = () => {
        return Math.random() * 28 - 28;
    };

    return (
        <Draggable
            initialPosition={position}
            size={thisSize}
            onDragStart={onDragStart}
            zIndexOrder={zIndexOrder}
        >
            <div
                className="column-content pile-container"
                ref={cardPileRef}
                style={{
                    position: 'absolute',
                    width: thisSize.x,
                    height: thisSize.y,
                    left: position.x + 'px',
                    top: position.y + 'px',
                }}
            >

                <div
                    className="game-element-title"
                >
                    {config.pile.title}
                </div>
                <div
                    className={"button button-small " + (counter === 0 && 'button-disabled')}
                    onClick={handleAddCard}
                >
                    {config.pile.buttonText}
                </div>
                <div
                    className="game-txt"
                    style={{
                        fontWeight: counter * 9,
                    }}
                >
                {counter > 0 && ` ${counter}`}
                    </div>
            </div>
        </Draggable>
    );
};

export default CardPile;
