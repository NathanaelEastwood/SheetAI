import React, { forwardRef, useEffect, useRef } from "react";

interface TableProperties {
    style?: React.CSSProperties;
    width: number;
    height: number;
}

const Table = forwardRef<HTMLCanvasElement, TableProperties>((tableProperties, ref) => {
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
                    ctx.lineTo(80 * j, canvas.height); // Correct logic for cell lines
                    ctx.stroke();
                }
            }
        }
    }, [tableProperties, ref]);

    return <canvas ref={ref || localCanvasRef} height={1000} style={tableProperties.style}></canvas>;
});

export default Table;
