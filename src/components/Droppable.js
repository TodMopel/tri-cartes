import React, { useRef, useState, useEffect } from 'react';

const Droppable = ({ children, cardMoving, categoryMoving, mousePosition, onCardEnter, onCardLeave }) => {
    const droppableRef = useRef(null);
    const [isMouseOverZone, setIsMouseOverZone] = useState(false);

    useEffect(() => {
        if ((cardMoving || categoryMoving) && mousePosition) {
            const droppableElement = droppableRef.current;
            if (droppableElement) {
                const rect = droppableElement.getBoundingClientRect();
                const isMouseOverRect = (
                    mousePosition.x >= rect.left &&
                    mousePosition.x <= rect.right &&
                    mousePosition.y >= rect.top &&
                    mousePosition.y <= rect.bottom
                );
                setIsMouseOverZone(isMouseOverRect);
            }
        }
    }, [mousePosition]);

    useEffect(() => {
        if (isMouseOverZone) {
            onCardEnter();
        } else {
            onCardLeave();
        }
    }, [isMouseOverZone]);

    return (
        <div
            ref={droppableRef}
        >
            {children}
        </div>
    );
};

export default Droppable;
