import { useState, useEffect, useRef } from "react";
import Cell from "../../Entities/Table/Cell";
import {useSelector} from "react-redux";
import {RootState} from "../../main";

interface CellHighlightParameters {
    left: number;
    right: number;
    top: number;
    bottom: number;
    columnNumber: number;
    rowNumber: number;
    isEditing: boolean;
    isMultiSelect: boolean;
    currentValue: Cell;
    visible?: boolean; // Added visible property with a default of true
    isCopyHighlighter?: boolean;
    onInputChange: (value: Cell, columnNumber: number, rowNumber: number) => void;
}

const CellHighlighter: React.FC<CellHighlightParameters> = (cellHighlightParameters: CellHighlightParameters) => {
    // Initialize state with props
    const [highlightCoordinates, setHighlightCoordinates] = useState<CellHighlightParameters>({
        ...cellHighlightParameters,
        visible: cellHighlightParameters.visible ?? true, // Default to true if undefined
        isCopyHighlighter: cellHighlightParameters.isCopyHighlighter ?? false // Default to false if undefined
    });

    const darkModeState: boolean = useSelector((state: RootState) => state.globalDarkMode);

    const inputRef = useRef<HTMLInputElement>(null);

    // Update state when props change
    useEffect(() => {
        setHighlightCoordinates({
            ...cellHighlightParameters,
            visible: cellHighlightParameters.visible ?? true, // Ensure the default is applied if not provided
        });
    }, [cellHighlightParameters]);

    const selectionWidth = highlightCoordinates.right - highlightCoordinates.left;
    const selectionHeight = highlightCoordinates.bottom - highlightCoordinates.top;

    const handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            highlightCoordinates.onInputChange(
                new Cell(inputRef.current?.value || "", inputRef.current?.value || "", structuredClone(cellHighlightParameters.currentValue.Dependants)),
                highlightCoordinates.columnNumber,
                highlightCoordinates.rowNumber
            );

            // Create a new object instead of mutating the old one
            setHighlightCoordinates({
                ...highlightCoordinates,
                isEditing: false,
            });
        }
    };

    // Render only if visible
    if (!highlightCoordinates.visible) {
        return null;
    }

    return (
        <div
            style={{
                position: "absolute",
                top: `${highlightCoordinates.top}px`,
                left: `${highlightCoordinates.left}px`,
                width: `${selectionWidth}px`,
                height: `${selectionHeight}px`,
                backgroundColor: darkModeState ? (highlightCoordinates.isMultiSelect && !highlightCoordinates.isCopyHighlighter
                    ? "rgba(38, 0, 255, 0.09)"
                    : "rgba(255, 255, 255, 0)") : (highlightCoordinates.isMultiSelect && !highlightCoordinates.isCopyHighlighter
                    ? "rgb(217,255,0, 0.09)"
                    : "rgb(0,0,0, 0)"
                ),
                border: highlightCoordinates.isCopyHighlighter ? "2px dashed": "2px solid",
                borderRadius: "2px",
                borderColor: darkModeState ? (highlightCoordinates.isEditing ? "#00308F" : "#7CB9E8") : (highlightCoordinates.isEditing ? "#ffcf70" : "#834617"),
                pointerEvents: "none",
            }}
            onKeyDown={handleInput}
        >
            {highlightCoordinates.isEditing && (
                <input
                    type="text"
                    defaultValue={highlightCoordinates.currentValue.UnderlyingValue}
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: `${selectionWidth - 5}px`,
                        height: `${selectionHeight - 5}px`,
                        backgroundColor: darkModeState ? "rgba(255, 255, 255, 100)" : "rgba(0, 0, 0, 100)",
                        color: darkModeState ? "black" : "white",
                        border: "none",
                        textAlign: "left",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "text",
                        pointerEvents: "auto",
                    }}
                    ref={inputRef}
                    autoFocus
                />
            )}
        </div>
    );
};

export default CellHighlighter;
