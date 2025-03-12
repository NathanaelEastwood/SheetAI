import React, { forwardRef, MouseEventHandler, useEffect, useRef, useState } from "react";
import CellHighlighter from "./CellHighlighter";
import TableData from "../../Entities/Table/TableData";
import parse from "../../Entities/Table/FormulaParser";
import Cell from "../../Entities/Table/Cell";
import evaluateDependencies from "../../Entities/Table/DependencyEvaluator";
import {Scalars} from "../../Entities/Table/Scalars";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../main";
import {updateGlobalTableData, updateSelectedCell} from "../../Entities/Table/globalStateStore";


interface TableProperties {
    style?: React.CSSProperties;
    horizontalScalars: Scalars;
    verticalScalars: Scalars;
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
}

const Table = forwardRef<HTMLCanvasElement, TableProperties>((tableProperties, ref) => {

    const dispatch = useDispatch();
    const tableData = useSelector((state: RootState) => state.globalTableData.value);

    const darkModeState: boolean = useSelector((state: RootState) => state.globalDarkMode);

    // Create refs for scrollX and scrollY
    const scrollXRef = useRef<number>(tableProperties.scrollX);
    const scrollYRef = useRef<number>(tableProperties.scrollY);

    // Scalar data
    const [horizontalScalar, setHorizontalScalar] = useState<Scalars>(tableProperties.horizontalScalars);
    const [verticalScalar, setVerticalScalar] = useState<Scalars>(tableProperties.verticalScalars);
    let horizontalScalarRef = useRef<Scalars>(horizontalScalar);
    horizontalScalarRef.current = horizontalScalar;
    let verticalScalarRef = useRef<Scalars>(verticalScalar);
    verticalScalarRef.current = verticalScalar;

    // Use state for highlighting position and editing state
    const [highlightData, setHighlightData] = useState<{ top: number; left: number; columnNumber: number; rowNumber: number; bottom: number; right: number; isMultiSelect: boolean}>({ top: 0, left: 0, columnNumber: 0, rowNumber: 0, bottom: verticalScalar.scalars[0], right: horizontalScalar.scalars[0], isMultiSelect: false });
    const [isHighlightEditing, setIsHighlightEditing] = useState<boolean>(false);
    let isHighlightEditingRef = useRef(false)
    isHighlightEditingRef.current = isHighlightEditing;

    // position and visibility of copy location highlighter
    const [copyOriginHighlightData, setCopyOriginHighlightData] = useState<{ top: number; left: number; columnNumber: number; rowNumber: number; bottom: number; right: number; isMultiSelect: boolean, isVisible: boolean}>({ top: 0, left: 0, columnNumber: 0, rowNumber: 0, bottom: 30, right: 80, isMultiSelect: false, isVisible: false });
    const [isCopyOriginHighlightingVisible, setIsCopyOriginHighlightingVisible] = useState<boolean>(false);
    let copyOriginColumnNumberRef = useRef<number>();
    copyOriginColumnNumberRef.current = copyOriginHighlightData.columnNumber;
    let copyOriginRowNumberRef = useRef<number>();
    copyOriginRowNumberRef.current = copyOriginHighlightData.rowNumber;

    // Selection state and reference variables
    let selectionStartColumnRef = useRef(highlightData.columnNumber);
    selectionStartColumnRef.current = highlightData.columnNumber;
    let selectionStartRowRef = useRef(highlightData.rowNumber);
    selectionStartRowRef.current = highlightData.rowNumber;
    let selectionEndColumnRef = useRef(0);
    let selectionEndRowRef = useRef(0);

    const copiedData = useRef(new TableData([]));

    // Mouse state for evaluating a drag select
    let isDragging = useRef(false);
    let dragStartCellCoordinates = useRef([0, 0])

    // Update the refs whenever scrollX or scrollY changes
    useEffect(() => {
        scrollXRef.current = tableProperties.scrollX;
        scrollYRef.current = tableProperties.scrollY;
        setHorizontalScalar(tableProperties.horizontalScalars);
        setVerticalScalar(tableProperties.verticalScalars);
    }, [tableProperties.scrollX, tableProperties.scrollY, tableProperties.horizontalScalars]);

    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");

            let pixelWidth = horizontalScalar.pixelLength;
            let pixelHeight = verticalScalar.pixelLength;
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;

            if (ctx) {
                let cumulativeHeight = 0;
                ctx.fillStyle = darkModeState ? "white" : "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw table cells
                for (let i = 0; i < tableProperties.height; i++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = darkModeState ? "#D3D3D3" : "#FFFFFF";
                    ctx.moveTo(0, verticalScalar.scalars[i] + cumulativeHeight);
                    ctx.lineTo(canvas.width, verticalScalar.scalars[i] + cumulativeHeight);
                    ctx.stroke();
                    cumulativeHeight += verticalScalar.scalars[i];
                }

                let cumulativeWidth = 0

                for (let j = 0; j < tableProperties.width; j++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = darkModeState ? "#D3D3D3" : "#FFFFFF";
                    ctx.moveTo(cumulativeWidth + horizontalScalar.scalars[j], 0);
                    ctx.lineTo(cumulativeWidth + horizontalScalar.scalars[j], canvas.height);
                    ctx.stroke();
                    cumulativeWidth += horizontalScalar.scalars[j];
                }

                ctx.font = "15px serif";
                ctx.fillStyle = darkModeState ? "black" : "white";
                for (let x = 0; x < tableProperties.width; x++){
                    for (let y = 0; y < tableProperties.height; y++)
                    {
                        let cellValue = tableData.getCellValue(x, y)
                        if (cellValue.RenderedValue != '')
                        {
                            ctx.fillText(cellValue.RenderedValue, (horizontalScalar.getPositionFromIndex(x)) + (horizontalScalar.scalars[x] - 15)/2 , (verticalScalar.getPositionFromIndex(y)) + (verticalScalar.scalars[y] + 10)/2);
                        }
                    }
                }
            }
        }
    }, [tableProperties.width, tableProperties.height, ref, tableData, tableProperties.horizontalScalars, tableProperties.verticalScalars, darkModeState]);

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

        dispatch(updateSelectedCell([columnNumber, rowNumber]))

        selectionEndRowRef.current = rowNumber;
        selectionEndColumnRef.current = columnNumber;

        // Initialize the dragging and where the drag started (if drag is less than a certain distance we will ignore in the other event handlers, but we cannot know that in advance)
        dragStartCellCoordinates.current = cellCoords;
        isDragging.current = true;

        const xSnappingCoordinate = horizontalScalarRef.current.getPositionFromIndex(columnNumber);
        const ySnappingCoordinate = verticalScalarRef.current.getPositionFromIndex(rowNumber);

        // Always highlight the cell immediately
        setHighlightData({ top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: rowNumber, bottom: ySnappingCoordinate + verticalScalarRef.current.scalars[rowNumber], right: xSnappingCoordinate + horizontalScalarRef.current.scalars[columnNumber], isMultiSelect: false });
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

    const handleCellEntry = (value: Cell, columnNumber: number, rowNumber: number) => {
        // TODO: Implement a partial re-draw perhaps if performance becomes an issue?
        if (value.UnderlyingValue[0] == '=') {
            value = parse(value, tableData, [columnNumber, rowNumber]);
        }
        let newTableData = tableData.setCellValue(value, columnNumber, rowNumber)
        newTableData = evaluateDependencies(newTableData, value, new Set<Cell>());
        dispatch(updateGlobalTableData(newTableData))
        const newRowNumber = rowNumber + 1;
        const xSnappingCoordinate = horizontalScalar.getPositionFromIndex(columnNumber);
        const ySnappingCoordinate = verticalScalar.getPositionFromIndex(newRowNumber);
        setHighlightData({top: ySnappingCoordinate, left: xSnappingCoordinate, columnNumber: columnNumber, rowNumber: newRowNumber, bottom: ySnappingCoordinate + verticalScalarRef.current.scalars[newRowNumber], right: xSnappingCoordinate + horizontalScalarRef.current.scalars[columnNumber], isMultiSelect: false})
        dispatch(updateSelectedCell([columnNumber, rowNumber]))
    }

    const handleGlobalKeypress = (event: KeyboardEvent) => {

        // TODO: This is a stop gap solution, really things should respond contextually with the input open.
        if (isHighlightEditingRef.current) {
            return
        }

        // TODO: Refactor this event handler because it is poo poo
        if (event.ctrlKey) {
            if (event.key == "c") {

                const top = selectionStartRowRef.current < selectionEndRowRef.current ? verticalScalarRef.current.getPositionFromIndex(selectionStartRowRef.current) :
                    verticalScalarRef.current.getPositionFromIndex(selectionEndRowRef.current);

                const left = selectionStartColumnRef.current < selectionEndColumnRef.current ? horizontalScalarRef.current.getPositionFromIndex(selectionStartColumnRef.current) :
                    horizontalScalarRef.current.getPositionFromIndex(selectionEndColumnRef.current);

                const bottom = (selectionStartRowRef.current > selectionEndRowRef.current ? verticalScalarRef.current.getPositionFromIndex(selectionStartRowRef.current) + verticalScalarRef.current.scalars[selectionStartRowRef.current] :
                    verticalScalarRef.current.getPositionFromIndex(selectionEndRowRef.current) + verticalScalarRef.current.scalars[selectionEndRowRef.current]);

                const right = (selectionStartColumnRef.current > selectionEndColumnRef.current ? horizontalScalarRef.current.getPositionFromIndex(selectionStartColumnRef.current) + horizontalScalarRef.current.scalars[selectionStartRowRef.current] :
                    horizontalScalarRef.current.getPositionFromIndex(selectionEndColumnRef.current) + horizontalScalarRef.current.scalars[selectionEndColumnRef.current]);

                const columnNumber = selectionStartColumnRef.current < selectionEndColumnRef.current ? selectionStartColumnRef.current : selectionEndColumnRef.current;
                const rowNumber = selectionStartRowRef.current < selectionEndRowRef.current ? selectionStartRowRef.current : selectionEndRowRef.current;

                setCopyOriginHighlightData({top: top, columnNumber: columnNumber, rowNumber: rowNumber, left: left, bottom: bottom, right: right, isMultiSelect: true, isVisible: true})
                setIsCopyOriginHighlightingVisible(true);
                copiedData.current = tableData.copy(selectionStartColumnRef.current, selectionEndColumnRef.current, selectionStartRowRef.current, selectionEndRowRef.current);
            } else if (event.key == "v" && copiedData.current.data.length > 0) {

                // TODO: Detect when a paste larger than the current canvas is done, and expand the canvas with it
                tableData.paste(copiedData.current, selectionStartColumnRef.current, selectionStartRowRef.current, copyOriginColumnNumberRef.current || 0, copyOriginRowNumberRef.current || 0);
                dispatch(updateGlobalTableData(new TableData(tableData.data)))

                // Create a new instance of the TableData to trigger re-render
                // setTableData(new TableData(updatedTableData));

                let dX = copiedData.current.data[0].length;
                let dY = copiedData.current.data.length;

                setHighlightData((prevData) => {
                    let topEdge : number;
                    let bottomEdge : number;
                    let rightEdge : number;
                    let leftEdge : number;

                    topEdge = verticalScalarRef.current.getPositionFromIndex(selectionStartRowRef.current);
                    bottomEdge = verticalScalarRef.current.getPositionFromIndex(selectionStartRowRef.current + dY);

                    leftEdge = horizontalScalarRef.current.getPositionFromIndex(selectionStartColumnRef.current);
                    rightEdge = horizontalScalarRef.current.getPositionFromIndex(selectionStartColumnRef.current + dX);


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
            let originalCell = tableData.getCellValue(selectionStartColumnRef.current, selectionStartRowRef.current);
            let newCell = new Cell('', '', structuredClone(originalCell.Dependants));
            let updatedTableData = tableData.setCellValue(newCell, selectionStartColumnRef.current, selectionStartRowRef.current);
            updatedTableData = evaluateDependencies(updatedTableData, newCell, new Set<Cell>());
            dispatch(updateGlobalTableData(updatedTableData))
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
                    newRow = Math.max(newRow + 1, 0);
                    dispatch(updateSelectedCell([newCol, newRow]))
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    newRow = Math.max(newRow - 1, 0);
                    dispatch(updateSelectedCell([newCol, newRow]))
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    newCol = Math.max(newCol - 1, 0);
                    dispatch(updateSelectedCell([newCol, newRow]))
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    newCol = Math.max(newCol + 1, 0);
                    dispatch(updateSelectedCell([newCol, newRow]))
                    break;
                default:
                    return prevData; // No change, exit early
            }


            return {
                top: verticalScalarRef.current.getPositionFromIndex(newRow),
                left: horizontalScalarRef.current.getPositionFromIndex(newCol),
                rowNumber: newRow,
                columnNumber: newCol,
                bottom: verticalScalarRef.current.getPositionFromIndex(newRow) + verticalScalar.scalars[newRow],
                right: horizontalScalarRef.current.getPositionFromIndex(newCol) + horizontalScalar.scalars[newCol],
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
                        // topCell = (endingCellCoords[1] * 30);
                        topCell = verticalScalarRef.current.getPositionFromIndex(endingCellCoords[1]);
                        // bottomCell = dragStartCellCoordinates.current[1] * 30;
                        bottomCell = verticalScalarRef.current.getPositionFromIndex(dragStartCellCoordinates.current[1]);
                    } else {
                        topCell = prevData.top;
                        // bottomCell = (endingCellCoords[1] * 30) + 30;
                        bottomCell = verticalScalarRef.current.getPositionFromIndex(endingCellCoords[1]) + verticalScalar.scalars[endingCellCoords[1]];
                    }

                    if (dX < 0) {
                        // rightCell = dragStartCellCoordinates.current[0] * 80;
                        rightCell = horizontalScalarRef.current.getPositionFromIndex(dragStartCellCoordinates.current[0]);
                        // leftCell = (endingCellCoords[0] * 80);
                        leftCell = horizontalScalarRef.current.getPositionFromIndex(endingCellCoords[0]);
                    } else {
                        // rightCell = (endingCellCoords[0] * 80) + 80;
                        leftCell = prevData.left;
                        rightCell = horizontalScalarRef.current.getPositionFromIndex(endingCellCoords[0]) + horizontalScalar.scalars[endingCellCoords[0]];
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

    function findTableCell(event: React.MouseEvent, scrollX: number, scrollY: number) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // TODO: look into why these correction factors are needed and why they are hardcoded
        const tableX = mouseX + scrollX - 100;
        const tableY = mouseY + scrollY - 230;

        // const columnNumber = Math.floor(tableX / 80);
        // const rowNumber = Math.floor(tableY / 30);
        const columnNumber = horizontalScalarRef.current.getIndexFromPosition(tableX);
        const rowNumber = verticalScalarRef.current.getIndexFromPosition(tableY);

        return [columnNumber, rowNumber];
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
                currentValue={new Cell('', '', new Set<[number, number]>())}
                visible={isCopyOriginHighlightingVisible}
                isCopyHighlighter={true}
            />
        </>
    );
});

export default Table;


