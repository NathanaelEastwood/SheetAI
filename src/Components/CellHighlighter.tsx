import {useState, useEffect, EventHandler, MouseEventHandler, useRef} from "react";

interface HighlightCoordinates {
    left: number;
    right: number;
    top: number;
    bottom: number;
    columnNumber: number;
    rowNumber: number;
    isEditing: boolean;
    onInputChange: (value: [string, string], columnNumber: number, rowNumber: number) => void;
}

const CellHighlighter: React.FC<HighlightCoordinates> = (_highlightCoordinates: HighlightCoordinates) => {
    // Initialize state with props
    const [highlightCoordinates, setHighlightCoordinates] = useState<HighlightCoordinates>(_highlightCoordinates);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update state when props change
    useEffect(() => {
        setHighlightCoordinates(_highlightCoordinates);
    }, [_highlightCoordinates]);

    const cellWidth = highlightCoordinates.right - highlightCoordinates.left;
    const cellHeight = highlightCoordinates.bottom - highlightCoordinates.top;

    const handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // TODO: Put current cell contents into the input box
        if (event.key === 'Enter') {
            highlightCoordinates.onInputChange(
                [inputRef.current?.value || '', inputRef.current?.value || ''],
                highlightCoordinates.columnNumber,
                highlightCoordinates.rowNumber
            );

            // Create a new object instead of mutating the old one
            setHighlightCoordinates({
                ...highlightCoordinates,
                isEditing: false
            });
        }
    };


    return (
        <div
            style={{
                position: "absolute",
                top: `${highlightCoordinates.top - 30}px`,
                left: `${highlightCoordinates.left}px`,
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
                border: "2px solid",
                borderRadius: "2px",
                borderColor: highlightCoordinates.isEditing ? "#00308F" : "#7CB9E8", // Orange border when editing
                pointerEvents: "none",
            }}
            onKeyDown={handleInput}
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
                    ref = {inputRef}
                    autoFocus
                />
            )}
        </div>
    );
};

export default CellHighlighter;
