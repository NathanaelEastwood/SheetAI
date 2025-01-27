import {useState, useEffect, useRef} from "react";

interface CellHighlightParameters {
    left: number;
    right: number;
    top: number;
    bottom: number;
    columnNumber: number;
    rowNumber: number;
    isEditing: boolean;
    isMultiSelect: boolean;
    currentValue: [string, string]
    onInputChange: (value: [string, string], columnNumber: number, rowNumber: number) => void;
}

const CellHighlighter: React.FC<CellHighlightParameters> = (cellHighlightParameters: CellHighlightParameters) => {
    // Initialize state with props
    const [highlightCoordinates, setHighlightCoordinates] = useState<CellHighlightParameters>(cellHighlightParameters);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update state when props change
    useEffect(() => {
        setHighlightCoordinates(cellHighlightParameters);
    }, [cellHighlightParameters]);

    const selectionWidth = highlightCoordinates.right - highlightCoordinates.left;
    const selectionHeight = highlightCoordinates.bottom - highlightCoordinates.top;

    const handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
                width: `${selectionWidth}px`,
                height: `${selectionHeight}px`,
                backgroundColor: highlightCoordinates.isMultiSelect ? "rgba(38, 0, 255, 0.09)" : "rgba(255, 255, 255, 0)",
                border: "2px solid",
                borderRadius: "2px",
                borderColor: highlightCoordinates.isEditing ? "#00308F" : "#7CB9E8",
                pointerEvents: "none",
            }}
            onKeyDown={handleInput}
        >
            {highlightCoordinates.isEditing && (
                <input
                    type="text"
                    defaultValue={highlightCoordinates.currentValue[0]}
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: `${selectionWidth - 5}px`,
                        height: `${selectionHeight - 5}px`,
                        backgroundColor: "rgba(255, 255, 255, 100)",
                        border: "none",
                        textAlign: "left",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "text",
                        pointerEvents: "auto",
                    }}
                    ref = {inputRef}
                    autoFocus
                />
            )}
        </div>
    );
};

export default CellHighlighter;
