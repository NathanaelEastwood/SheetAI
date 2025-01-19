import {useState, useEffect, EventHandler, MouseEventHandler, useRef} from "react";

interface CellHighlightParameters {
    left: number;
    right: number;
    top: number;
    bottom: number;
    columnNumber: number;
    rowNumber: number;
    isEditing: boolean;
    currentValue: [string, string]
    onInputChange: (value: [string, string], columnNumber: number, rowNumber: number) => void;
}

const CellHighlighter: React.FC<CellHighlightParameters> = (_highlightCoordinates: CellHighlightParameters) => {
    // Initialize state with props
    const [highlightCoordinates, setHighlightCoordinates] = useState<CellHighlightParameters>(_highlightCoordinates);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update state when props change
    useEffect(() => {
        setHighlightCoordinates(_highlightCoordinates);
    }, [_highlightCoordinates]);

    const selectionWidth = highlightCoordinates.right - highlightCoordinates.left;
    const selectionHeight = highlightCoordinates.bottom - highlightCoordinates.top;

    const handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // TODO: Put current cell contents into the input box
        if (event.key === 'Enter') {
            if (inputRef.current) {
                inputRef.current.textContent = highlightCoordinates.currentValue[1];
            }

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
                width: `${selectionWidth}px`,
                height: `${selectionHeight}px`,
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
                        width: `${selectionWidth}px`,
                        height: `${selectionHeight}px`,
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
