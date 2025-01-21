import React, { forwardRef, MouseEventHandler, useEffect, useRef, useState } from "react";
import CellHighlighter from "./CellHighlighter";
import TableData from "../Entities/TableData";

interface TableProperties {
    style?: React.CSSProperties;
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
    data: TableData;
}

const Table = forwardRef<HTMLCanvasElement, TableProperties>((tableProperties, ref) => {
    // Create refs for scrollX and scrollY
    const scrollXRef = useRef<number>(tableProperties.scrollX);
    const scrollYRef = useRef<number>(tableProperties.scrollY);

    // Use state for highlighting position and editing state
    const [highlightData, setHighlightData] = useState<{ top: number; left: number; columnNumber: number; rowNumber: number; bottom: number; right: number; }>({ top: 0, left: 0, columnNumber: 0, rowNumber: 0, bottom: 30, right: 80});
    const [isHighlightEditing, setIsHighlightEditing] = useState<boolean>(false);
    let columnRef = useRef(highlightData.columnNumber);
    let rowRef = useRef(highlightData.rowNumber);

    // table data
    const [tableData, setTableData] = useState<TableData>(tableProperties.data);

    // Mouse state for evaluating a drag select
    let isDragging = useRef(false);
    let dragStartCellCoordinates = useRef([0, 0])

    // Update the refs whenever scrollX or scrollY changes
    useEffect(() => {
        scrollXRef.current = tableProperties.scrollX;
        scrollYRef.current = tableProperties.scrollY;
    }, [tableProperties.scrollX, tableProperties.scrollY]);

    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = tableProperties.width * 80;
            canvas.height = tableProperties.height * 30;
            if (ctx) {
                // Draw table cells
                for (let i = 0; i < tableProperties.height; i++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "#D3D3D3";
                    ctx.moveTo(0, 30 * i);
                    ctx.lineTo(canvas.width, 30 * i);
                    ctx.stroke();
                }

                for (let j = 0; j < tableProperties.width; j++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "#D3D3D3";
                    ctx.moveTo(80 * j, 0);
                    ctx.lineTo(80 * j, canvas.height);
                    ctx.stroke();
                }

                ctx.font = "15px serif";
                ctx.fillStyle = "black";
                for (let x = 0; x < tableProperties.width; x++){
                    for (let y = 0; y < tableProperties.height; y++)
                    {
                        if (tableData.getCellValue(x, y)[0] != '')
                        {
                            ctx.fillText(tableData.getCellValue(x, y)[0], (x * 80) + 35, (y * 30) - 10);
                        }
                    }
                }
            }
        }
    }, [tableProperties.width, tableProperties.height, ref, tableData]);

    useEffect(() => {
        window.addEventListener("keydown", handleGlobalKeypress);

        return () => {
            window.removeEventListener("keydown", handleGlobalKeypress);
        };
    }, []);

    const clickTimeout = useRef<number | null>(null);

    const handleCellClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (!canvas) return;

        const cellCoords = findTableCell(event, tableProperties.scrollX, tableProperties.scrollY);
        const columnNumber = cellCoords[0];
        const rowNumber = cellCoords[1];

        // Initialize the dragging and where the drag started (if drag is less than a certain distance we will ignore in the other event handlers, but we cannot know that in advance)
        dragStartCellCoordinates.current = cellCoords;
        isDragging.current = true;

        const xSnappingCoordinate = columnNumber * 80;
        const ySnappingCoordinate = rowNumber * 30;

        // Always highlight the cell immediately
        setHighlightData({ top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: rowNumber, bottom: ySnappingCoordinate + 30, right: xSnappingCoordinate + 80 });
        columnRef.current = columnNumber;
        rowRef.current = rowNumber;
        setIsHighlightEditing(false);

        if (event.detail === 1) {
            // Single click detected
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
            }

            clickTimeout.current = window.setTimeout(() => {
                clickTimeout.current = null;
            }, 200); // Short delay for double-click detection
        }
        if (event.detail === 2) {
            // Double-click detected
            setIsHighlightEditing(true);
            // Add more double-click behavior here if needed
        }
    };

    const handleCellEntry = (value: [string, string], columnNumber: number, rowNumber: number) => {
        // TODO: Implement a partial re-draw perhaps if performance becomes an issue?
        setTableData(tableData.setCellValue(value, columnNumber, rowNumber))
        const xSnappingCoordinate = (columnNumber) * 80;
        const ySnappingCoordinate = (rowNumber + 1) * 30;
        setHighlightData({top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: rowNumber + 1, bottom: ySnappingCoordinate + 30, right: xSnappingCoordinate + 80})
        columnRef.current = columnNumber
        rowRef.current = rowNumber
    }

    const handleGlobalKeypress = (event: KeyboardEvent) => {

        // TODO: Refactor this event handler because it is poo poo

        if (event.key == "Enter" && !isHighlightEditing)
        {
            setIsHighlightEditing(true);
            return
        }

        if (event.key == "Delete")
        {
            setTableData(tableData.setCellValue(['', ''], columnRef.current, rowRef.current))
            setIsHighlightEditing(false);
            return
        }

        if (event.key == "Escape"){
            setIsHighlightEditing(false);
            return
        }

        setHighlightData((prevData) => {
            let newRow = prevData.rowNumber;
            let newCol = prevData.columnNumber;
            // TODO: Make window scroll when selected cell reaches the edge.
            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    newRow = Math.max(newRow + 1, 1);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    newRow = Math.max(newRow - 1, 1);
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    newCol = Math.max(newCol - 1, 0);
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    newCol = Math.max(newCol + 1, 0);
                    break;
                default:
                    return prevData; // No change, exit early
            }

            columnRef.current = newCol;
            rowRef.current = newRow;

            return {
                top: newRow * 30,
                left: newCol * 80,
                rowNumber: newRow,
                columnNumber: newCol,
                bottom: (newRow * 30) + 30,
                right: (newCol * 80) + 80
            };
        });
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        isDragging.current = false;
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const endingCellCoords = findTableCell(event, scrollXRef.current, scrollYRef.current);
        const dX = endingCellCoords[0] - dragStartCellCoordinates.current[0];
        const dY = endingCellCoords[1] - dragStartCellCoordinates.current[1];
        if (isDragging.current && !isHighlightEditing && (Math.abs(dX) > 0 || Math.abs(dY) > 0)) {

            setHighlightData((prevData) => {
                let topCell;
                let bottomCell;
                let rightCell;
                let leftCell;

                if (dY < 0) {
                    topCell = (endingCellCoords[1] * 30);
                    bottomCell = dragStartCellCoordinates.current[1] * 30;
                } else {
                    topCell = prevData.top;
                    bottomCell = (endingCellCoords[1] * 30) + 30;
                }

                if (dX < 0) {
                    rightCell = dragStartCellCoordinates.current[0] * 80;
                    leftCell = (endingCellCoords[0] * 80);
                } else {
                    rightCell = (endingCellCoords[0] * 80) + 80;
                    leftCell = prevData.left;
                }

                return {
                    top: topCell,
                    left: leftCell,
                    right: rightCell,
                    bottom: bottomCell,
                    columnNumber: prevData.columnNumber,
                    rowNumber: prevData.rowNumber
                }
            })
        }
    }


    return (
        <>
            <canvas ref={ref || localCanvasRef} style={tableProperties.style} onMouseDown={handleCellClick} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}></canvas>
            <CellHighlighter
                left={highlightData.left}
                right={highlightData.right}
                top={highlightData.top}
                bottom={highlightData.bottom}
                rowNumber={highlightData.rowNumber}
                columnNumber={highlightData.columnNumber}
                isEditing={isHighlightEditing}
                onInputChange={handleCellEntry}
                currentValue={tableData.data[highlightData.rowNumber][highlightData.columnNumber]}
            />
        </>
    );
});

export default Table;

function findTableCell(event: React.MouseEvent, scrollX: number, scrollY: number) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const tableX = mouseX + scrollX - 20;
    const tableY = mouseY + scrollY - 230;

    const columnNumber = Math.floor(tableX / 80);
    const rowNumber = Math.floor(tableY / 30);

    return [columnNumber - 1, rowNumber + 1];
}
