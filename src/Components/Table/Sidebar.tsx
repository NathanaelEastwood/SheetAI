import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Scalars } from "../../Entities/Table/Scalars";

interface SidebarProps {
    startingNumber: number;
    height: number;
    verticalScalars: Scalars;
    style?: React.CSSProperties;
    scrollY: number;
    adjustScalars: (index: number, distance: number) => void;
}

const Sidebar = forwardRef<HTMLCanvasElement, SidebarProps>(({ style, height, startingNumber, verticalScalars, scrollY, adjustScalars }, ref) => {
    const localCanvasRef = useRef<HTMLCanvasElement>(null);
    const [rowHeadings, setRowHeadings] = useState<number[]>(() =>
        generateRowHeadings(height, startingNumber)
    );
    const [verticalScalarsState, setVerticalScalars] = useState<Scalars>(verticalScalars);
    const [draggingRowBorder, setDraggingRowBorder] = useState<boolean>(false);
    const [dragCurrentLocation, setDragCurrentLocation] = useState<number>(0);
    let hoveringResize = useRef<boolean>(false);
    let dragStartLocation = useRef<number>(0);

    useEffect(() => {
        setRowHeadings(generateRowHeadings(height, startingNumber));
        setVerticalScalars(verticalScalars);
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = 100;
                canvas.height = verticalScalarsState.pixelLength;

                ctx.fillStyle = "#f8f9fa"; // Light gray background
                ctx.fillRect(0, 0, 100, verticalScalarsState.pixelLength);

                ctx.font = "14px 'Segoe UI', 'Roboto', sans-serif'";
                ctx.fillStyle = "#2c5282"; // Blue text
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#e0e0e0"; // Soft gray borders

                // Draw left border
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, verticalScalarsState.pixelLength);
                ctx.stroke();

                // Stronger right separation
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#d1d5db"; // Slightly darker gray
                ctx.beginPath();
                ctx.moveTo(99.5, 0); // Slightly inset from edge
                ctx.lineTo(99.5, verticalScalarsState.pixelLength);
                ctx.stroke();

                // Reset for row lines
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#e0e0e0";

                let cumulativeYPosition = 0;
                rowHeadings.forEach((value: number, index: number) => {
                    const rowHeight = verticalScalarsState.scalars[index];
                    const nextY = cumulativeYPosition + rowHeight;

                    // Horizontal row lines
                    ctx.beginPath();
                    ctx.moveTo(0, nextY);
                    ctx.lineTo(100, nextY);
                    ctx.stroke();

                    // Center the text vertically
                    const textY = cumulativeYPosition + (rowHeight / 2) + 5; // +5 for baseline adjustment
                    const textX = 50 - (ctx.measureText(String(value)).width / 2); // Center horizontally
                    ctx.fillText(String(value), textX, textY);

                    cumulativeYPosition = nextY;
                });
            }
        }
    }, [height, startingNumber, verticalScalars]);

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let absoluteY = event.clientY + scrollY - 230;
        if (!draggingRowBorder) {
            const canvas = event.currentTarget;
            let hovering = verticalScalars.pointIsWithinDistanceOfEdge(absoluteY, 5);
            hoveringResize.current = hovering;
            canvas.style.cursor = hovering ? "row-resize" : "default";
        } else {
            setDragCurrentLocation(event.clientY - 200);
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!hoveringResize.current) {
            return;
        } else {
            setDraggingRowBorder(true);
            dragStartLocation.current = event.clientY + scrollY - 230;
            setDragCurrentLocation(event.clientY - 200);
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingRowBorder) {
            return;
        }
        let dragEnd = event.clientY + scrollY - 230;
        setDraggingRowBorder(false);
        if (Math.abs(dragEnd - dragStartLocation.current) > 5) {
            const startIndex = verticalScalarsState.getIndexFromPosition(dragStartLocation.current);
            adjustScalars(startIndex, dragEnd - dragStartLocation.current);
        }
    };

    const quitEvent = () => {
        setDraggingRowBorder(false);
    };

    return (
        <>
            <div style={{
                height: "2px",
                width: "5000px",
                backgroundColor: "#2c5282", // Blue drag indicator
                position: "absolute",
                top: dragCurrentLocation,
                left: 0,
                visibility: draggingRowBorder ? "visible" : "hidden",
                opacity: 0.8,
                zIndex: 10
            }}></div>
            <canvas
                ref={ref || localCanvasRef}
                style={{
                    ...style,
                    backgroundColor: "#f8f9fa",
                    boxShadow: "2px 0 4px rgba(0, 0, 0, 0.15)", // Stronger shadow on right
                }}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={quitEvent}
            />
        </>
    );
});

export default React.memo(Sidebar);

function generateRowHeadings(numRows: number, startingNumber: number): number[] {
    let result = [];
    for (let i = startingNumber; i < numRows; i++) {
        result.push(i);
    }
    return result;
}