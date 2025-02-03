import React, { forwardRef, useEffect, useRef, useState } from "react";
import {Scalars} from "../Entities/Scalars";

interface SidebarProps {
    startingNumber: number;
    height: number;
    verticalScalars: Scalars;
    style?: React.CSSProperties;
}

const Sidebar = forwardRef<HTMLCanvasElement, SidebarProps>(({ style, height, startingNumber, verticalScalars }, ref) => {
    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    // Recalculate rowHeadings when height or startingNumber changes
    const [rowHeadings, setRowHeadings] = useState<number[]>(() =>
        generateRowHeadings(height, startingNumber)
    );

    const [verticalScalarsState, setVerticalScalars] = useState<Scalars>(verticalScalars)

    useEffect(() => {
        setRowHeadings(generateRowHeadings(height, startingNumber));
    }, [height, startingNumber]);

    // Effect to handle canvas drawing and state updates
    useEffect(() => {
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

    return <canvas ref={ref || localCanvasRef} style={style}></canvas>;
});

export default React.memo(Sidebar);

function generateRowHeadings(numRows: number, startingNumber: number): number[] {
    let result = [];
    for (let i = startingNumber; i < numRows; i++) {
        result.push(i);
    }
    return result;
}
