import React, { forwardRef, useEffect, useRef, useState } from "react";

interface SidebarProps {
    startingNumber: number;
    height: number;
    style?: React.CSSProperties;
}

const Sidebar = forwardRef<HTMLCanvasElement, SidebarProps>(({ style, height, startingNumber }, ref) => {
    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    // Recalculate rowHeadings when height or startingNumber changes
    const [rowHeadings, setRowHeadings] = useState<number[]>(() =>
        generateRowHeadings(height, startingNumber)
    );

    useEffect(() => {
        setRowHeadings(generateRowHeadings(height, startingNumber));
    }, [height, startingNumber]);

    // Effect to handle canvas drawing and state updates
    useEffect(() => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");

            if (ctx) {
                // Get the dynamic height value using window.innerHeight for 100vh
                let calculatedHeight: number = window.innerHeight - 50;
                let calculatedWidth: number = style?.width ? parseInt(style.width.toString(), 10) : 100; // Default to 100 if no width is given
                // Set canvas width and height dynamically
                canvas.width = calculatedWidth;
                canvas.height = height * 30;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 100, height * 30);

                ctx.beginPath();
                // Set up the drawing context
                ctx.font = "15px serif";
                ctx.fillStyle = "black";
                ctx.lineWidth = 1;
                ctx.moveTo(100, 0);
                ctx.lineTo(100, height * 30);

                rowHeadings.forEach((value: number, index: number) => {
                    ctx.moveTo(0, 30 * index + 30);
                    ctx.lineTo(100, 30 * index + 30);

                    ctx.stroke();
                    const y = 30 * index + 20; // Calculate y-coordinate for each number
                    const x = 45; // Fixed x-coordinate
                    ctx.fillText(String(value), x, y);
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
