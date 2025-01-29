import React, { forwardRef, MouseEventHandler, useEffect, useRef, useState } from "react";
import CellHighlighter from "./CellHighlighter";
import TableData from "../Entities/TableData";
import Parse from "../Entities/FormulaParser";
import parse from "../Entities/FormulaParser";


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
    const [highlightData, setHighlightData] = useState<{ top: number; left: number; columnNumber: number; rowNumber: number; bottom: number; right: number; isMultiSelect: boolean}>({ top: 0, left: 0, columnNumber: 0, rowNumber: 0, bottom: 30, right: 80, isMultiSelect: false });
    const [isHighlightEditing, setIsHighlightEditing] = useState<boolean>(false);
    let isHighlightEditingRef = useRef(false)
    isHighlightEditingRef.current = isHighlightEditing;

    // position and visibility of copy location highlighter
    const [copyOriginHighlightData, setCopyOriginHighlightData] = useState<{ top: number; left: number; columnNumber: number; rowNumber: number; bottom: number; right: number; isMultiSelect: boolean, isVisible: boolean}>({ top: 0, left: 0, columnNumber: 0, rowNumber: 0, bottom: 30, right: 80, isMultiSelect: false, isVisible: false });
    const [isCopyOriginHighlightingVisible, setIsCopyOriginHighlightingVisible] = useState<boolean>(false);

    // Selection state and reference variables
    let selectionStartColumnRef = useRef(highlightData.columnNumber);
    selectionStartColumnRef.current = highlightData.columnNumber;
    let selectionStartRowRef = useRef(highlightData.rowNumber);
    selectionStartRowRef.current = highlightData.rowNumber;
    let selectionEndColumnRef = useRef(0);
    let selectionEndRowRef = useRef(0);

    // table data
    const [tableData, setTableData] = useState<TableData>(tableProperties.data);
    const copiedData = useRef(new TableData([]))

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

            // TODO: Hardcoded multiplier values which won't work once cells are expandable

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
                        let cellValue = tableData.getCellValue(x, y)
                        if (cellValue[0] != '')
                        {
                            ctx.fillText(cellValue[0], (x * 80) + 35, (y * 30) - 10);
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

        selectionEndRowRef.current = rowNumber;
        selectionEndColumnRef.current = columnNumber;

        // Initialize the dragging and where the drag started (if drag is less than a certain distance we will ignore in the other event handlers, but we cannot know that in advance)
        dragStartCellCoordinates.current = cellCoords;
        isDragging.current = true;

        const xSnappingCoordinate = columnNumber * 80;
        const ySnappingCoordinate = rowNumber * 30;

        // Always highlight the cell immediately
        setHighlightData({ top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: rowNumber, bottom: ySnappingCoordinate + 30, right: xSnappingCoordinate + 80, isMultiSelect: false });
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
        if (value[1][0] == '=') {
            console.log("parsing formula")
            value = parse(value, tableData)
        }
        setTableData(tableData.setCellValue(value, columnNumber, rowNumber))
        const xSnappingCoordinate = (columnNumber) * 80;
        const ySnappingCoordinate = (rowNumber + 1) * 30;
        setHighlightData({top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: rowNumber + 1, bottom: ySnappingCoordinate + 30, right: xSnappingCoordinate + 80, isMultiSelect: false})
    }

    const handleGlobalKeypress = (event: KeyboardEvent) => {

        if (isHighlightEditingRef.current) {
            return
        }

        // TODO: Refactor this event handler because it is poo poo
        if (event.ctrlKey) {
            if (event.key == "c") {

                const top = selectionStartRowRef.current < selectionEndRowRef.current ? selectionStartRowRef.current * 30 : selectionEndRowRef.current * 30;
                const left = selectionStartColumnRef.current < selectionEndColumnRef.current ? selectionStartColumnRef.current * 80 : selectionEndColumnRef.current * 80;
                const bottom = (selectionStartRowRef.current > selectionEndRowRef.current ? selectionStartRowRef.current * 30 : selectionEndRowRef.current * 30) + 30;
                const right = (selectionStartColumnRef.current > selectionEndColumnRef.current ? selectionStartColumnRef.current * 80 : selectionEndColumnRef.current * 80) + 80;
                const columnNumber = selectionStartColumnRef.current < selectionEndColumnRef.current ? selectionStartColumnRef.current : selectionEndColumnRef.current;
                const rowNumber = selectionStartRowRef.current < selectionEndRowRef.current ? selectionStartRowRef.current : selectionEndRowRef.current;

                setCopyOriginHighlightData({top: top, columnNumber: columnNumber, rowNumber: rowNumber, left: left, bottom: bottom, right: right, isMultiSelect: true, isVisible: true})
                setIsCopyOriginHighlightingVisible(true);
                copiedData.current = tableData.copy(selectionStartColumnRef.current, selectionEndColumnRef.current, selectionStartRowRef.current, selectionEndRowRef.current);
            } else if (event.key == "v" && copiedData.current.data.length > 0) {

                // TODO: Detect when a paste larger than the current canvas is done, and expand the canvas with it

                const updatedTableData = tableData.paste(
                    copiedData.current,
                    selectionStartColumnRef.current,
                    selectionStartRowRef.current
                );

                // Create a new instance of the TableData to trigger re-render
                setTableData(new TableData(updatedTableData));

                let dX = copiedData.current.data[0].length;
                let dY = copiedData.current.data.length;

                setHighlightData((prevData) => {
                    let topEdge : number;
                    let bottomEdge : number;
                    let rightEdge : number;
                    let leftEdge : number;

                    topEdge = selectionStartRowRef.current * 30;
                    bottomEdge = (selectionStartRowRef.current + dY) * 30;

                    leftEdge = selectionStartColumnRef.current * 80;
                    rightEdge = (selectionStartColumnRef.current + dX) * 80;


                    return {
                        top: topEdge,
                        left: leftEdge,
                        right: rightEdge,
                        bottom: bottomEdge,
                        columnNumber: selectionStartColumnRef.current,
                        rowNumber: selectionStartRowRef.current,
                        isMultiSelect: true
                    }
                })
            }
        }

        if (event.key == "Enter" && !isHighlightEditing)
        {
            setIsHighlightEditing(true);
            return
        }

        if (event.key == "Delete")
        {
            setTableData(tableData.setCellValue(['', ''], selectionStartColumnRef.current, selectionStartRowRef.current))
            setIsHighlightEditing(false);
            return
        }

        if (event.key == "Escape"){
            setIsHighlightEditing(false);
            setIsCopyOriginHighlightingVisible(false);
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


            return {
                top: newRow * 30,
                left: newCol * 80,
                rowNumber: newRow,
                columnNumber: newCol,
                bottom: (newRow * 30) + 30,
                right: (newCol * 80) + 80,
                isMultiSelect: false
            };
        });
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        isDragging.current = false;
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDragging.current){
            const endingCellCoords = findTableCell(event, scrollXRef.current, scrollYRef.current);

            selectionEndColumnRef.current = endingCellCoords[0]
            selectionEndRowRef.current = endingCellCoords[1]

            const dX = endingCellCoords[0] - dragStartCellCoordinates.current[0];
            const dY = endingCellCoords[1] - dragStartCellCoordinates.current[1];
            if (!isHighlightEditing && (Math.abs(dX) > 0 || Math.abs(dY) > 0)) {

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
                        rowNumber: prevData.rowNumber,
                        isMultiSelect: true
                    }
                })
            }
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
                isMultiSelect={highlightData.isMultiSelect}
                currentValue={tableData.data[highlightData.rowNumber][highlightData.columnNumber]}
            />
            <CellHighlighter
                left={copyOriginHighlightData.left}
                right={copyOriginHighlightData.right}
                top={copyOriginHighlightData.top}
                bottom={copyOriginHighlightData.bottom}
                rowNumber={copyOriginHighlightData.rowNumber}
                columnNumber={copyOriginHighlightData.columnNumber}
                isEditing={false}
                onInputChange={handleCellEntry}
                isMultiSelect={copyOriginHighlightData.isMultiSelect}
                currentValue={["", ""]}
                visible={isCopyOriginHighlightingVisible}
                isCopyHighlighter={true}
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
