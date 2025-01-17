import React, { useEffect, useRef, useState, forwardRef } from "react";

interface TopbarProps {
    style?: React.CSSProperties;
    startingLetter: number;
    width: number;
}

const Topbar = forwardRef<HTMLCanvasElement, TopbarProps>(({ style, startingLetter, width }, ref) => {
    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    const [columnHeadings, setColumnHeadings] = useState<string[]>(() =>
        generateLetterList(width, startingLetter)
    );

    useEffect(() => {
        setColumnHeadings(generateLetterList(width, startingLetter));
    }, [width, startingLetter]);

    useEffect(() => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = width * 80;
                canvas.height = 30;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, 30);

                ctx.font = "15px serif";
                ctx.fillStyle = "black";
                ctx.lineWidth = 1;

                // Draw initial border lines
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 30);
                ctx.stroke();
                ctx.moveTo(0, 0);
                ctx.lineTo(canvas.width, 0);
                ctx.stroke();
                ctx.moveTo(0, 30)
                ctx.lineTo(canvas.width, 30);
                ctx.stroke();

                columnHeadings.forEach((letter, index) => {
                    const x = 80 * index;
                    const y = 20;

                    ctx.beginPath();
                    ctx.moveTo(x + 100, 0);
                    ctx.lineTo(x + 100, 30);
                    ctx.stroke();

                    ctx.fillText(letter, x + 50, y);
                });
            }
        }
    }, [columnHeadings, width]);

    return <canvas ref={ref || localCanvasRef} style={style}></canvas>;
});

export default React.memo(Topbar);

function generateLetterList(width: number, startingLetter: number): string[] {
    return Array.from({ length: width }, (_, i) => getLetterFromNumber(startingLetter + i));
}

function getLetterFromNumber(number: number): string {
    let result = "";
    while (number > 0) {
        let rem = (number - 1) % 26;
        result = String.fromCharCode("A".charCodeAt(0) + rem) + result;
        number = Math.floor((number - 1) / 26);
    }
    return result;
}
