import React, { useState, useEffect, useRef } from 'react';

const Draggable = ({ initialPosition, size, children, onDragStart, onDragEnd, onDragMove, zIndexOrder }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });

    const targetRef = useRef(null);

    const borderSize = 30;

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStartX + currentOffset.x;
                const deltaY = e.clientY - dragStartY + currentOffset.y;

                const clampedX = Math.min(Math.max(deltaX, -initialPosition.x + borderSize), window.innerWidth - size.x - initialPosition.x - borderSize);
                const clampedY = Math.min(Math.max(deltaY, -initialPosition.y + borderSize), window.innerHeight - size.y - initialPosition.y - borderSize);

                const transformValue = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
                targetRef.current.style.transform = transformValue;

                if (onDragMove)
                    onDragMove();
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);

            if (onDragEnd)
                onDragEnd();
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragStartY(e.clientY);
        targetRef.current = e.currentTarget;

        const currentTransform = targetRef.current.style.transform;
        const translateValues = currentTransform.match(/translate3d\(([^)]+)\)/);

        if (translateValues) {
            const transformArray = translateValues[1].split(/[\s,]+/);
            const translateX = parseFloat(transformArray[0]);
            const translateY = parseFloat(transformArray[1]);

            if (!isNaN(translateX) && !isNaN(translateY)) {
                setCurrentOffset({
                    x: translateX,
                    y: translateY,
                });
            }
        }

        if (onDragStart)
            onDragStart();
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'absolute',
                zIndex: zIndexOrder,
            }}
        >
            {children}
        </div>
    );
};

export default Draggable;
