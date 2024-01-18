import React, { useRef, useState, useEffect } from 'react';
import Draggable from './Draggable';
import Droppable from './Droppable';

import config from './../data/config';

const CardDiscard = ({ position, onDragStart, onCancel, cardMoving, mousePosition, onCardDropInsideDropZone, discardedCardsList, zIndexOrder}) => {
    const discardRef = useRef();
    const thisSize = config.discard.size;
    const dropZoneRef = useRef();
    const dropZoneSize = { x: 110, y: 50 };

    const [isDropZoneActive, setIsDropZoneActive] = useState(false);

    const handleCardEnter = () => {
        //console.log(`Card entered discard dropZone!`);
        if (cardMoving)
            setIsDropZoneActive(true);
    };

    const handleCardLeave = () => {
        //console.log(`Card left discard dropZone!`);
        if (cardMoving)
            setIsDropZoneActive(false);
    };

    useEffect(() => {
        if (isDropZoneActive) {
            onCardDropInsideDropZone("Discard");
            setIsDropZoneActive(false);
        }
    }, [cardMoving]);

    const handleCancel = () => {
        const rect = discardRef.current.getBoundingClientRect();
        const discardPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top,
        };
        onCancel(discardPosition);
    };

    return (
        <Draggable
            initialPosition={position}
            size={thisSize}
            onDragStart={onDragStart}
            zIndexOrder={zIndexOrder}
        >
            <div
                className="column-content discard-container"
                ref={discardRef}
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
                    {config.discard.title}
                </div>
                <Droppable
                    cardMoving={cardMoving}
                    mousePosition={mousePosition}
                    onCardEnter={handleCardEnter}
                    onCardLeave={handleCardLeave}
                >
                    <div
                        className="discard-drop-zone"
                        style={{
                            width: dropZoneSize.x,
                            height: dropZoneSize.y,
                            backgroundColor: !isDropZoneActive ? 'black' : 'darkgray',
                        }}
                    >
                    </div>
                </Droppable>

                {
                    discardedCardsList.length > -1 && (
                        <div
                            className={"button button-xsmall " + (discardedCardsList.length === 0 && 'button-disabled')}
                            onClick={handleCancel}
                        >
                            {config.discard.buttonText}
                        </div>
                    )
                }
            </div>
        </Draggable>
    );
};

export default CardDiscard;