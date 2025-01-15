import React, { useEffect, useRef, useState, forwardRef } from "react";

interface TopbarProps {
    style?: React.CSSProperties;
}

const Topbar = forwardRef<HTMLCanvasElement, TopbarProps>((props, ref) => {
    const { style } = props;
    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    const [width, setWidth] = useState<number>(24);
    const [startingLetter, setStartingLetter] = useState<number>(0);
    const [columnHeadings, setColumnHeadings] = useState<string[]>(() =>
        generateLetterList(width, startingLetter)
    );

    useEffect(() => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = 2000;
                canvas.height = 30;

                ctx.font = "15px serif";
                ctx.fillStyle = "black";

                ctx.beginPath();
                ctx.lineWidth = 1;

                ctx.moveTo(0, 0);
                ctx.lineTo(0, 30);
                ctx.stroke();

                ctx.lineTo(100, 30);
                ctx.stroke();

                ctx.moveTo(0, 0);
                ctx.lineTo(100, 0);
                ctx.stroke();

                columnHeadings.forEach((letter, index) => {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    const x = 80 * index + 55;
                    const y = 20;

                    ctx.moveTo(x + 45, 0);
                    ctx.lineTo(x + 45, 30);
                    ctx.stroke();

                    ctx.lineTo(x + 125, 30);
                    ctx.stroke();

                    ctx.moveTo(x + 45, 0);
                    ctx.lineTo(x + 125, 0);
                    ctx.stroke();

                    ctx.fillText(letter, x, y);
                });
            }
        }
    }, [columnHeadings]);

    return <canvas ref={ref || localCanvasRef} style={style}></canvas>;
});

export default Topbar;

function generateLetterList(width: number, startingLetter: number): string[] {
    let result = [];
    for (let i = startingLetter; i < startingLetter + width; i++) {
        result.push(getLetterFromNumber(i));
    }
    return result;
}

function getLetterFromNumber(number: number): string {
    let result = "";
    while (number > 0) {
        let rem = number % 26;
        if (rem === 0) {
            result += "Z";
            number = Math.floor(number / 26) - 1;
        } else {
            result += String.fromCharCode(number - 1 + "A".charCodeAt(0));
            number = Math.floor(number / 26);
        }
    }
    return result.split("").reverse().join("");
}
