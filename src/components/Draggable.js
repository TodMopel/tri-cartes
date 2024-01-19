import React, { useState, useEffect, useRef } from 'react';

const Draggable = ({ initialPosition, size, children, onDragStart, onDragEnd, onDragMove, zIndexOrder }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });

    const targetRef = useRef(null);

    const borderSize = 30;

    useEffect(() => {
        const handleMove = (clientX, clientY) => {
            if (isDragging) {
                const deltaX = clientX - dragStartX + currentOffset.x;
                const deltaY = clientY - dragStartY + currentOffset.y;

                const clampedX = Math.min(
                    Math.max(deltaX, -initialPosition.x + borderSize),
                    window.innerWidth - size.x - initialPosition.x - borderSize
                );
                const clampedY = Math.min(
                    Math.max(deltaY, -initialPosition.y + borderSize),
                    window.innerHeight - size.y - initialPosition.y - borderSize
                );

                const transformValue = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
                targetRef.current.style.transform = transformValue;

                if (onDragMove) onDragMove();
            }
        };

        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        };

        const handleMouseMove = (e) => {
            handleMove(e.clientX, e.clientY);
        };

        const handleMouseUp = () => {
            setIsDragging(false);

            if (onDragEnd) onDragEnd();
        };


        if (isDragging) {
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStartX(touch.clientX);
        setDragStartY(touch.clientY);
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

        if (onDragStart) onDragStart();
    };

    return (
        <div
            onMouseDown={handleTouchStart}
            onTouchStart={handleTouchStart}
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
