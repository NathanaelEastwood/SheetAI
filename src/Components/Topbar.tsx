import React, { useEffect, useRef, useState, forwardRef } from "react";
import {Scalars} from "../Entities/Scalars";

interface TopbarProps {
    style?: React.CSSProperties;
    startingLetter: number;
    horizontalScalars: Scalars;
    width: number;
    scrollX: number;
    scrollY: number;
    adjustScalars: (index: number, distance: number) => void;
}

const Topbar = forwardRef<HTMLCanvasElement, TopbarProps>(({ style, startingLetter, width, horizontalScalars, scrollX, scrollY, adjustScalars }, ref) => {
    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    const [columnHeadings, setColumnHeadings] = useState<string[]>(() =>
        generateLetterList(width, startingLetter)
    );

    const [horizontalScalarsState, setHorizontalScalarsState] = useState<Scalars>(horizontalScalars)
    const [draggingColumnBorder, setDraggingColumnBorder] = useState<boolean>(false);
    const [dragCurrentLocation, setDragCurrentLocation] = useState<number>(0);
    let hoveringResize = useRef<boolean>(false);
    let dragStartLocation = useRef<number>(0);

    useEffect(() => {
        setColumnHeadings(generateLetterList(width, startingLetter));
        setHorizontalScalarsState(horizontalScalars);
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = horizontalScalarsState.pixelLength;
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
                ctx.lineTo(canvas.width, 0);
                ctx.stroke();
                ctx.moveTo(0, 30)
                ctx.lineTo(canvas.width, 30);
                ctx.stroke();

                let cumulativeXPosition = 0
                columnHeadings.forEach((letter, index) => {
                    let x;
                    if (index == 0) {
                        x = 100;
                        cumulativeXPosition = 100
                    } else {
                        // Indexes are -1'd here as we shouldn't be consuming a member of the scalar for the blank part of the column headings
                        x = cumulativeXPosition + horizontalScalarsState.scalars[index - 1];
                        cumulativeXPosition += horizontalScalarsState.scalars[index - 1];
                    }
                    const y = 20;

                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 30);
                    ctx.stroke();

                    // TODO: Add properly calculated scaling factor, same for Sidebar
                    ctx.fillText(letter, x - (horizontalScalarsState.scalars[index - 1] * 0.55), y);
                });
            }
        }
    }, [width, horizontalScalars]);

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let absoluteX = event.clientX + scrollX - 100;
        if (!draggingColumnBorder) {
            const canvas = event.currentTarget; // Get the canvas element
            let hovering = horizontalScalarsState.pointIsWithinDistanceOfEdge(absoluteX, 5);
            hoveringResize.current = hovering;
            // Change cursor style based on hovering state
            canvas.style.cursor = hovering ? "col-resize" : "default";
        } else {
            setDragCurrentLocation(event.clientX);
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!hoveringResize.current){
            return
        } else {
            setDraggingColumnBorder(true);
            dragStartLocation.current = event.clientX + scrollX - 100;
            setDragCurrentLocation(event.clientX);
        }
    }

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingColumnBorder) {
            return;
        }
        let dragEnd = event.clientX + scrollX - 100;
        setDraggingColumnBorder(false);
        if (Math.abs(dragEnd - dragStartLocation.current) > 5) {
            const startIndex = horizontalScalarsState.getIndexFromPosition(dragStartLocation.current);
            adjustScalars(startIndex, dragEnd - dragStartLocation.current);
        }
    }

    const quitEvent = () => {
        setDraggingColumnBorder(false)
    }

    return (
        <>
            <div style={{height: "1000px", width: "0px", borderLeft: "solid", borderWidth: 1, position: "absolute", top: 0, left: dragCurrentLocation, visibility: draggingColumnBorder ? "visible" : "hidden"}}></div>
            <canvas ref={ref || localCanvasRef} style={style} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={quitEvent}></canvas>
        </>
    )
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
