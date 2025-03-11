import React, { useEffect, useRef, useState, forwardRef } from "react";
import { Scalars } from "../../Entities/Table/Scalars";
import { getLetterFromNumber } from "../../Entities/General/HelperFunctions";

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
    const [isReady, setIsReady] = useState<boolean>(false);
    const [columnHeadings, setColumnHeadings] = useState<string[]>([]);
    const [horizontalScalarsState, setHorizontalScalarsState] = useState<Scalars>(horizontalScalars);
    const [draggingColumnBorder, setDraggingColumnBorder] = useState<boolean>(false);
    const [dragCurrentLocation, setDragCurrentLocation] = useState<number>(0);
    let hoveringResize = useRef<boolean>(false);
    let dragStartLocation = useRef<number>(0);

    // Initialize column headings
    useEffect(() => {
        if (width > 0 && horizontalScalars) {
            const letters = generateLetterList(width, startingLetter);
            setColumnHeadings(letters);
            setHorizontalScalarsState(horizontalScalars);
            setIsReady(true);
        }
    }, [width, startingLetter, horizontalScalars]);

    // Render the topbar
    useEffect(() => {
        if (!isReady) return;

        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = horizontalScalarsState.pixelLength;
                canvas.height = 30;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#f8f9fa"; // Light gray background
                ctx.fillRect(0, 0, canvas.width, 30);

                ctx.font = "14px Segoe UI, Roboto, sans-serif";
                ctx.fillStyle = "#2c5282"; // Blue text
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#e0e0e0"; // Soft gray borders

                // Draw top border
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(canvas.width, 0);
                ctx.stroke();

                // Stronger bottom separation
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#d1d5db"; // Slightly darker gray
                ctx.beginPath();
                ctx.moveTo(0, 29.5); // Slightly inset from edge
                ctx.lineTo(canvas.width, 29.5);
                ctx.stroke();

                // Reset for column lines
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#e0e0e0";

                let cumulativeXPosition = 0;
                columnHeadings.forEach((letter, index) => {
                    let x;
                    if (index === 0) {
                        x = 100;
                        cumulativeXPosition = 100;
                    } else {
                        x = cumulativeXPosition + horizontalScalarsState.scalars[index - 1];
                        cumulativeXPosition += horizontalScalarsState.scalars[index - 1];
                    }
                    const y = 20;

                    // Vertical column lines
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 30);
                    ctx.stroke();

                    // Center the text with slight offset
                    const textWidth = ctx.measureText(letter).width;
                    ctx.fillText(letter, x - (horizontalScalarsState.scalars[index - 1] / 2) - (textWidth / 2), y);
                });
            }
        }
    }, [isReady, columnHeadings, horizontalScalarsState, width]);

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        if (!isReady) return;
        
        let absoluteX = event.clientX + scrollX - 100;
        if (!draggingColumnBorder) {
            const canvas = event.currentTarget;
            let hovering = horizontalScalarsState.pointIsWithinDistanceOfEdge(absoluteX, 5);
            hoveringResize.current = hovering;
            canvas.style.cursor = hovering ? "col-resize" : "default";
        } else {
            setDragCurrentLocation(event.clientX);
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        if (!isReady || !hoveringResize.current) return;
        
        setDraggingColumnBorder(true);
        dragStartLocation.current = event.clientX + scrollX - 100;
        setDragCurrentLocation(event.clientX);
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
        if (!isReady || !draggingColumnBorder) return;
        
        let dragEnd = event.clientX + scrollX - 100;
        setDraggingColumnBorder(false);
        if (Math.abs(dragEnd - dragStartLocation.current) > 5) {
            const startIndex = horizontalScalarsState.getIndexFromPosition(dragStartLocation.current);
            adjustScalars(startIndex, dragEnd - dragStartLocation.current);
        }
    };

    if (!isReady) {
        return null; // Don't render anything until we're ready
    }

    return (
        <>
            <div style={{
                height: "1000px",
                width: "2px",
                backgroundColor: "#2c5282",
                position: "absolute",
                top: 0,
                left: dragCurrentLocation,
                visibility: draggingColumnBorder ? "visible" : "hidden",
                opacity: 0.8,
                zIndex: 10
            }}
                 onMouseMove={handleMouseMove}
                 onMouseDown={handleMouseDown}
                 onMouseUp={handleMouseUp}>
            </div>
            <canvas
                ref={ref || localCanvasRef}
                style={{
                    ...style,
                    backgroundColor: "#f8f9fa",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)", // Stronger shadow at bottom
                }}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            />
        </>
    );
});

export default React.memo(Topbar);

function generateLetterList(width: number, startingLetter: number): string[] {
    return Array.from({ length: width }, (_, i) => getLetterFromNumber(startingLetter + i));
}