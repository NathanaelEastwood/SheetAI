import {useEffect, useRef, useState} from "react";

interface TopbarProps {
    style?: React.CSSProperties;
}

const Topbar: React.FC<TopbarProps> = (style) => {
    const [width, setWidth] = useState<number>(24);
    const [startingLetter, setStartingLetter] = useState<number>(0);
    const [columnHeadings, setColumnHeadings] = useState<string[]>(() => generateLetterList(width, startingLetter));

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // Set canvas dimensions (optional, adjust as needed)
                canvas.width = 2000;
                canvas.height = 100;

                // Set font and styling for text
                ctx.font = "15px serif";
                ctx.fillStyle = "black";

                ctx.beginPath();
                const x = 80 * -1 + 50; // Calculate x-coordinate for each letter
                const y = 50; // Fixed y-coordinate
                ctx.lineWidth = 1
                // draw vertical line preceding the letter.
                ctx.moveTo(0, 30);
                ctx.lineTo(0, 60)
                ctx.stroke();

                // draw horizontal bottom line
                ctx.lineTo(100, 60)
                ctx.stroke()

                // draw horizontal top line
                ctx.moveTo(0, 30)
                ctx.lineTo(100, 30)

                ctx.stroke()

                // Draw the letters on the canvas
                columnHeadings.forEach((letter, index) => {
                    ctx.beginPath();
                    const x = 80 * index + 55; // Calculate x-coordinate for each letter
                    const y = 50; // Fixed y-coordinate

                    // draw vertical line preceding the letter.
                    ctx.moveTo(x + 45, 30);
                    ctx.lineTo(x + 45, 60)
                    ctx.stroke();

                    // draw horizontal bottom line
                    ctx.lineTo(x + 125, 60)
                    ctx.stroke()

                    // draw horizontal top line
                    ctx.moveTo(x + 45, 30)
                    ctx.lineTo(x + 125, 30)

                    ctx.stroke()

                    ctx.fillText(letter, x, y);
                });
            }
        }
    }, [columnHeadings]); // Re-run the effect if columnHeadings change

    return <canvas ref={canvasRef}></canvas>;
}

export default Topbar

function generateLetterList(width: number, startingLetter: number): string[] {
    let result = []
    for (let i = startingLetter; i < startingLetter + width; i++) {
        result.push(getLetterFromNumber(i))
    }
    return result
}

function getLetterFromNumber(number: number): string {
    let result = "";
    while(number > 0) {
        let rem = number % 26;

        if (rem == 0) {
            result += 'Z'
            number = Math.floor((number / 26) - 1);
        } else {
            result += String.fromCharCode(number - 1 + "A".charCodeAt(0));
            number = Math.floor(number/26);
        }
    }

    return result.split("").reverse().join("");
}