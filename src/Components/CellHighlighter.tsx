import { useState, useEffect } from "react";

interface HighlightCoordinates {
    left: number;
    right: number;
    top: number;
    bottom: number;
    isEditing: boolean;
}

const CellHighlighter: React.FC<HighlightCoordinates> = (_highlightCoordinates) => {
    // Initialize state with props
    const [highlightCoordinates, setHighlightCoordinates] = useState<HighlightCoordinates>(_highlightCoordinates);

    // Update state when props change
    useEffect(() => {
        setHighlightCoordinates(_highlightCoordinates);
    }, [_highlightCoordinates]);

    const cellWidth = highlightCoordinates.right - highlightCoordinates.left;
    const cellHeight = highlightCoordinates.bottom - highlightCoordinates.top;

    return (
        <div
            style={{
                position: "absolute",
                top: `${highlightCoordinates.top}px`,
                left: `${highlightCoordinates.left}px`,
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
                border: "2px solid",
                borderRadius: "2px",
                borderColor: highlightCoordinates.isEditing ? "#FF4500" : "#6495ED", // Orange border when editing
                pointerEvents: "none",
            }}
        >
            {highlightCoordinates.isEditing && (
                <input
                    type="text"
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        paddingBottom: "5px",
                        width: `${cellWidth}px`,
                        height: `${cellHeight}px`,
                        backgroundColor: "transparent",
                        border: "none",
                        textAlign: "left",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "text",
                        pointerEvents: "auto"
                    }}
                    autoFocus
                />
            )}
        </div>
    );
};

export default CellHighlighter;
