import React from 'react';
import Draggable from './Draggable';

import config from './../data/config';

const Card = ({ text, position, onDragStart, onDragEnd, onDragMove, zIndexOrder }) => {
    const thisSize = config.card.size;

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
                <div
                    className="card card-txt"
                >
                    {text}
                </div>
            </div>
        </Draggable>
    );
};

export default Card;
