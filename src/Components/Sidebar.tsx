import React, { forwardRef, useEffect, useRef, useState } from "react";
import {Scalars} from "../Entities/Scalars";

interface SidebarProps {
    startingNumber: number;
    height: number;
    verticalScalars: Scalars;
    style?: React.CSSProperties;
    adjustScalars: (index: number, distance: number) => void;
}

const Sidebar = forwardRef<HTMLCanvasElement, SidebarProps>(({ style, height, startingNumber, verticalScalars, adjustScalars }, ref) => {
    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    // Recalculate rowHeadings when height or startingNumber changes
    const [rowHeadings, setRowHeadings] = useState<number[]>(() =>
        generateRowHeadings(height, startingNumber)
    );

    const [verticalScalarsState, setVerticalScalars] = useState<Scalars>(verticalScalars);
    const [draggingRowBorder, setDraggingRowBorder] = useState<boolean>(false);
    const [dragCurrentLocation, setDragCurrentLocation] = useState<number>(0);

    let hoveringResize  = useRef<boolean>(false);
    let dragStartLocation = useRef<number>(0);

    // Effect to handle canvas drawing and state updates
    useEffect(() => {
        setRowHeadings(generateRowHeadings(height, startingNumber));
        setVerticalScalars(verticalScalars);
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");

            if (ctx) {
                // Set canvas width and height dynamically
                canvas.width = 100;
                canvas.height = verticalScalarsState.pixelLength;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 100, height * 30);

                ctx.beginPath();
                // Set up the drawing context
                ctx.font = "15px serif";
                ctx.fillStyle = "black";
                ctx.lineWidth = 1;
                ctx.moveTo(100, 0);
                ctx.lineTo(100, height * 30);
                ctx.stroke();
                let cumulativeYPosition = 0; /*-verticalScalarsState.scalars[0]*/
                rowHeadings.forEach((value: number, index: number) => {

                    // TODO: Fix line thickness issue from pixel scaling.

                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.moveTo(0, cumulativeYPosition + verticalScalarsState.scalars[index]);
                    ctx.lineTo(100, cumulativeYPosition + verticalScalarsState.scalars[index]);
                    ctx.stroke();
                    const y = cumulativeYPosition + verticalScalarsState.scalars[index] - (verticalScalarsState.scalars[index] * (1/3)); // Calculate y-coordinate for each number
                    const x = 45; // Fixed x-coordinate
                    ctx.fillText(String(value), x, y);
                    cumulativeYPosition += verticalScalarsState.scalars[index];
                });
            }
        }
    }, [height, startingNumber, style]); // Redraw when height, startingNumber, or style change

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let absoluteY = event.clientY + scrollY - 230;
        if (!draggingRowBorder) {
            const canvas = event.currentTarget; // Get the canvas element
            let hovering = verticalScalars.pointIsWithinDistanceOfEdge(absoluteY, 5);
            hoveringResize.current = hovering;
            // Change cursor style based on hovering state
            canvas.style.cursor = hovering ? "row-resize" : "default";
        } else {
            setDragCurrentLocation(event.clientY - 200);
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!hoveringResize.current){
            return
        } else {
            setDraggingRowBorder(true);
            dragStartLocation.current = event.clientY + scrollY - 230;
            setDragCurrentLocation(event.clientY - 200);
        }
    }

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingRowBorder) {
            return;
        }
        let dragEnd = event.clientY + scrollY - 230;
        setDraggingRowBorder(false);
        if (Math.abs(dragEnd - dragStartLocation.current) > 5) {
            const startIndex = verticalScalarsState.getIndexFromPosition(dragStartLocation.current);
            adjustScalars(startIndex, dragEnd - dragStartLocation.current);
        }
    }

    const quitEvent = () => {
        setDraggingRowBorder(false)
    }

    return (
        <>
            <div style={{
                height: "0",
                width: "5000px",
                borderTop: "solid",
                borderWidth: 1,
                position: "absolute",
                top: dragCurrentLocation,
                left: 0,
                visibility: draggingRowBorder ? "visible" : "hidden"
            }}></div>
            <canvas ref={ref || localCanvasRef} style={style} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={quitEvent}></canvas>
        </>
    )
});

export default React.memo(Sidebar);

function generateRowHeadings(numRows: number, startingNumber: number): number[] {
    let result = [];
    for (let i = startingNumber; i < numRows; i++) {
        result.push(i);
    }
    return result;
}
