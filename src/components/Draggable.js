import React, { useState, useEffect, useRef } from 'react';

const Draggable = ({ initialPosition, size, children, onDragStart, onDragEnd, onDragMove, zIndexOrder }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    const targetRef = useRef(null);

    const mapBorderSize = 30;

    useEffect(() => {
        const handleMove = (e) => {
            if (isDragging) {
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const deltaX = clientX - dragStartX + currentOffset.x;
                const deltaY = clientY - dragStartY + currentOffset.y;

                const clampedX = Math.min(Math.max(deltaX, -initialPosition.x + mapBorderSize), window.innerWidth - size.x - initialPosition.x - mapBorderSize);
                const clampedY = Math.min(Math.max(deltaY, -initialPosition.y + mapBorderSize), window.innerHeight - size.y - initialPosition.y - mapBorderSize);

                const transformValue = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
                targetRef.current.style.transform = transformValue;

                if (onDragMove)
                    onDragMove();
            }
        };

        const handleUp = () => {
            setIsDragging(false);

            if (onDragEnd)
                onDragEnd();

            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, currentOffset, dragStartX, dragStartY, initialPosition, onDragEnd, onDragMove, size]);

    const handleDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.touches ? e.touches[0].clientX : e.clientX);
        setDragStartY(e.touches ? e.touches[0].clientY : e.clientY);
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
            onMouseDown={handleDown}
            onTouchStart={handleDown}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'absolute',
                zIndex: zIndexOrder,

                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
        >
            {children}
        </div>
    );
};

export default Draggable;
