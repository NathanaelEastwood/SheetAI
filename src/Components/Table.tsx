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
            if (ctx) {
                // Draw table cells
                for (let i = 2; i < tableProperties.height + 2; i++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "#D3D3D3";
                    ctx.moveTo(0, (30 * i));
                    ctx.lineTo(canvas.width, (30 * i));
                    ctx.stroke();
                }

                for (let j = 2; j < tableProperties.width + 2; j++) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "#D3D3D3";
                    ctx.moveTo(80 * j + 20, 0);
                    ctx.lineTo(80 * j + 20, canvas.height); // Correct logic for cell lines
                    ctx.stroke();
                }
            }
        }
    }, [tableProperties, ref]);

    return <canvas ref={ref || localCanvasRef} width={1950} height={1000} style={tableProperties.style}></canvas>;
});

export default Table;
