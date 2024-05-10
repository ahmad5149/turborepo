import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
    COLUMN: "column"
};

export const Column = ({ id, children, rowIndex, columnIndex, index, moveColumn }) => {
    const ref = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const handleHover = () => {
        setIsHovering(true);
        if (isHovering && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const topOffset = rect.top + window.scrollY;
            const bottomOffset = rect.bottom + window.scrollY;
            if (topOffset < 0 || bottomOffset > window.innerHeight) {
                window.scrollTo({
                    top: window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2,
                    behavior: "smooth"
                });
            }
        }
    };

    const handleLeave = () => {
        setIsHovering(false);
    };

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.COLUMN,
        item: { id, index, rowIndex, columnIndex },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            opacity: monitor.isDragging() ? 1 : 1
        })
    });

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.COLUMN,
        drop(item, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;
            const dragRowIndex = item.rowIndex;
            const hoverRowIndex = rowIndex;
            const dragColumnIndex = item.columnIndex;
            const hoverColumnIndex = columnIndex;

            if (dragIndex === hoverIndex && dragRowIndex === hoverRowIndex && dragColumnIndex === hoverColumnIndex) {
                return;
            }

            moveColumn(dragIndex, hoverIndex, dragRowIndex, hoverRowIndex, dragColumnIndex, hoverColumnIndex);

            item.index = hoverIndex;
            item.rowIndex = hoverRowIndex;
            item.columnIndex = hoverColumnIndex;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    });

    drag(drop(ref));

    return (
        <div
            className="col-sm-12 col-md-4 col-lg-4 disable-ripple"
            ref={ref}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            disableripple={"true"}
            style={{
                opacity: isDragging ? 0.5 : 1,
                border: isOver ? "2px solid #091e4224" : "2px solid transparent",
                borderRadius: isOver && "10px",
                cursor: isDragging ? "grab" : "pointer",
                padding: isOver && "2px",
                transition: "background-color 0.3s ease, opacity 0.2s ease-in-out", // Combined transition properties
                userSelect: "none",
                transform: "translate3d(0,0,0)"
            }}>
            {children}
        </div>
    );
};
