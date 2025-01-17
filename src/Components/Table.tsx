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
    const [highlightData, setHighlightData] = useState<{ top: number; left: number; columnNumber: number; rowNumber: number; }>({ top: 0, left: 0, columnNumber: 0, rowNumber: 0 });
    const [isHighlightEditing, setIsHighlightEditing] = useState<boolean>(false);

    // table data
    const [tableData, setTableData] = useState<TableData>(tableProperties.data);

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

        const xSnappingCoordinate = columnNumber * 80;
        const ySnappingCoordinate = rowNumber * 30;

        // Always highlight the cell immediately
        setHighlightData({ top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: rowNumber });
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
        // TODO: Implement a partial re-draw perhaps?
        console.log("Setting value")
        setTableData(tableData.setCellValue(value, columnNumber, rowNumber))
        const xSnappingCoordinate = (columnNumber) * 80;
        const ySnappingCoordinate = (rowNumber + 1) * 30;
        setHighlightData({top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: rowNumber + 1})
    }

    const handleGlobalKeypress = (event: KeyboardEvent) => {

        if (event.key == "Enter" && !isHighlightEditing)
        {
            setIsHighlightEditing(true);
        }

        setHighlightData((prevData) => {
            let newRow = prevData.rowNumber;
            let newCol = prevData.columnNumber;

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

            return {
                top: newRow * 30,
                left: newCol * 80,
                rowNumber: newRow,
                columnNumber: newCol,
            };
        });
    };


    return (
        <>
            <canvas ref={ref || localCanvasRef} style={tableProperties.style} onMouseDown={handleCellClick}></canvas>
            <CellHighlighter
                left={highlightData.left}
                right={highlightData.left + 80}
                top={highlightData.top}
                bottom={highlightData.top + 30}
                rowNumber={highlightData.rowNumber}
                columnNumber={highlightData.columnNumber}
                isEditing={isHighlightEditing}
                onInputChange={handleCellEntry}
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
