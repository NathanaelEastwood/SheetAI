import React, {forwardRef, MouseEventHandler, useEffect, useRef, useState} from "react";
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
    const [highlightPosition, setHighlightPosition] = useState<{top: number, left: number}>({top: 0, left: 0});

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
                    ctx.moveTo(0, (30 * i));
                    ctx.lineTo(canvas.width, (30 * i));
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

    const selectCell: MouseEventHandler<HTMLCanvasElement> = (event) => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const tableX = mouseX + scrollXRef.current - 20;
            const tableY = mouseY + scrollYRef.current - 230;

            const columnNumber = Math.floor(tableX / 80);
            const rowNumber = Math.floor(tableY / 30);

            // The xSnapping value is the X value (-) the offset to arrive at the nearest cell left hand boundary
            // The ySnapping value is the Y value (-) the offset to arrive at the nearest cell bottom boundary

            const currentXScrollOffset = scrollXRef.current % 80;
            const currentYScrollOffset = scrollYRef.current % 30;

            const xSnappingCoordinate = ((columnNumber - 1) * 80) - currentXScrollOffset;
            const ySnappingCoordinate  = (rowNumber * 30) - currentYScrollOffset;

            console.log(`ColumnNumber: ${columnNumber}, RowNumber: ${rowNumber}`)

            setHighlightPosition({top: ySnappingCoordinate, left: xSnappingCoordinate})
        }
    };

    return (
        <>
            <canvas ref={ref || localCanvasRef} style={tableProperties.style} onClick={selectCell}></canvas>
            <CellHighlighter left={highlightPosition?.left} right={highlightPosition?.left + 80} top={highlightPosition?.top} bottom={highlightPosition.top + 30} />
        </>
    )
});

export default Table;
