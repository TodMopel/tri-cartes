import React, { useRef, useState, useEffect } from 'react';
import Draggable from './Draggable';
import Droppable from './Droppable';
import Card from './Card';

import config from './../data/config';

const InfoPanel = ({ position, onDragStart, cardMoving, mousePosition, onCardDropInsideDropZone, zIndexOrder, droppedCard, onCardRestored }) => {
    const infoPanelRef = useRef();
    const thisSize = config.infoPanel.size;
    const panelSize = config.card.size;
    const dropZoneSize = config.card.size;

    const dropZoneRef = useRef();

    const [isDropZoneActive, setIsDropZoneActive] = useState(false);

    const handleCardEnter = () => {
        //console.log(`Card entered infoPanel dropZone!`);
        setIsDropZoneActive(true);
    };

    const handleCardLeave = () => {
        //console.log(`Card left infoPanel dropZone!`);
        setIsDropZoneActive(false);
    };

    useEffect(() => {
        if (isDropZoneActive) {
            onCardDropInsideDropZone("InfoPanel");
            setIsDropZoneActive(false);
        }
    }, [cardMoving]);

    const handleRecoverCard = () => {
        if (droppedCard) {
            const rect = infoPanelRef.current.getBoundingClientRect();
            const position = {
                x: rect.left + 6,
                y: rect.top + 35,
            };
            //console.log(droppedCard.text);
            onCardRestored(position, droppedCard)
        }
    };

    return (
        <Draggable
            initialPosition={position}
            size={thisSize}
            onDragStart={onDragStart}
            zIndexOrder={zIndexOrder}
        >
            <div
                ref={infoPanelRef}
                className="column-content info-container"
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
                    {config.infoPanel.title}
                </div>

                {droppedCard ? (
                    <div>
                        <div
                            className="center-content info-container-panel  panel-txt"
                            style={{
                                position: 'absolute',
                                top: -125 + 'px',
                                left: -45 + 'px',
                                width: panelSize.x * 1.5,
                                height: panelSize.y * 1.5,
                            }}
                        >
                            <div
                                className="game-txt"
                            >
                            {droppedCard.description}
                            </div>
                        </div>

                        <div
                            className="card-container"
                        >
                            <div
                                onClick={handleRecoverCard}
                                className="card"
                                style={{
                                    width: dropZoneSize.x,
                                    height: dropZoneSize.y,
                                }}
                            >
                                {droppedCard.text}
                                <div
                                    className="game-txt"
                                    style={{
                                        position: 'absolute',

                                        top: 80 + 'px',
                                        color: 'darkgray',
                                    }}
                                >
                                    {config.infoPanel.buttonText}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                        <Droppable
                            cardMoving={cardMoving}
                            mousePosition={mousePosition}
                            onCardEnter={handleCardEnter}
                            onCardLeave={handleCardLeave}
                        >
                            <div
                                className="drop-zone-default"
                                style={{
                                    width: dropZoneSize.x,
                                    height: dropZoneSize.y,
                                    backgroundColor: !isDropZoneActive ? '#FFCA0080' : 'transparent',
                                }}
                            >
                            </div>
                        </Droppable>
                    )}
            </div>
        </Draggable>
    );
};

export default InfoPanel;