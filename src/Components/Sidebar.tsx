import {useEffect, useRef, useState} from "react";

interface SidebarProps {
    style?: React.CSSProperties;
}

const Sidebar: React.FC<SidebarProps> = ({ style }) => {
    const [height, setWidth] = useState<number>(50);
    const [startingNumber, setStartingLetter] = useState<number>(1);
    const [rowHeadings, setRowHeadings] = useState<number[]>(() => generateRowHeadings(startingNumber, height));
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");

            if (ctx) {
                // Get the dynamic height value using window.innerHeight for 100vh
                let calculatedHeight: number = window.innerHeight - 50;
                let calculatedWidth: number = style?.width ? parseInt(style.width.toString(), 10) : 100; // 50px adjustment (same as '50px' in the calc)
                 // Default to 100 if no width is given
                // Set canvas width and height dynamically
                canvas.width = calculatedWidth
                canvas.height = calculatedHeight;
                ctx.beginPath();
                // Set up the drawing context
                ctx.font = "15px serif";
                ctx.fillStyle = "black";
                ctx.lineWidth = 1;
                ctx.moveTo(100, 0)
                ctx.lineTo(100, calculatedHeight)

                rowHeadings.forEach((value: number, index: number) => {
                    ctx.moveTo(0, 30 * index + 42.5);
                    ctx.lineTo(100, 30 * index + 42.5);

                    ctx.stroke();
                    const y = 30 * index + 35; // Calculate y-coordinate for each number
                    const x = 45; // Fixed x-coordinate
                    ctx.fillText(String(value), x, y);
                });
            }
        }
    }, [rowHeadings, style]); // Add style to the dependencies array

    return <canvas ref={canvasRef} style={style}></canvas>; // Apply the style prop to canvas
};

export default Sidebar;

function generateRowHeadings(startingNumber: number, numRows: number): number[] {
    let result = [];
    for (let i = startingNumber; i < numRows; i++) {
        result.push(i);
    }
    return result;
}
