import React, { forwardRef, MouseEventHandler, useEffect, useRef, useState } from "react";
import CellHighlighter from "./CellHighlighter";

interface TableProperties {
    style?: React.CSSProperties;
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
}

const Table = forwardRef<HTMLCanvasElement, TableProperties>((tableProperties, ref) => {
    // Create refs for scrollX and scrollY
    const scrollXRef = useRef<number>(tableProperties.scrollX);
    const scrollYRef = useRef<number>(tableProperties.scrollY);

    // Use state for highlighting position and editing state
    const [highlightPosition, setHighlightPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [isHighlightEditing, setIsHighlightEditing] = useState<boolean>(false);

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
            }
        }
    }, [tableProperties.width, tableProperties.height, ref]);

    const clickTimeout = useRef<number | null>(null);

    const handleCellClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (!canvas) return;

        const cellCoords = findTableCell(event, tableProperties.scrollX, tableProperties.scrollY);
        const columnNumber = cellCoords[0];
        const rowNumber = cellCoords[1];

        const xSnappingCoordinate = (columnNumber - 1) * 80;
        const ySnappingCoordinate = rowNumber * 30;

        // Always highlight the cell immediately
        setHighlightPosition({ top: ySnappingCoordinate, left: xSnappingCoordinate });
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

    return (
        <>
            <canvas ref={ref || localCanvasRef} style={tableProperties.style} onMouseDown={handleCellClick}></canvas>
            <CellHighlighter
                left={highlightPosition.left}
                right={highlightPosition.left + 80}
                top={highlightPosition.top}
                bottom={highlightPosition.top + 30}
                isEditing={isHighlightEditing}
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

    return [columnNumber, rowNumber];
}
