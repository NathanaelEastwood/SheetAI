import React, { useEffect, useRef, useState } from "react";
import Table from "../Components/Table";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import generateEmptyTable from "../Entities/generateEmptyTable";
import {Scalars} from "../Entities/Scalars";

const TableContainer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLCanvasElement>(null);
    const topRef = useRef<HTMLCanvasElement>(null);
    const sideRef = useRef<HTMLCanvasElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // top bar values
    const [startingLetter, setStartingLetter] = useState(0);
    const [topBarWidth, setTopBarWidth] = useState(40);
    const [horizontalScalars, setHorizontalScalars] = useState(() => new Scalars(Array.from({ length: 20 }, () => 160)));

    let readyToUpdateXAxis = true;

    // sidebar values
    const [startingNumber, setStartingNumber] = useState(1);
    const [sideBarHeight, setSideBarHeight] = useState(100);
    const [verticalScalars, setVerticalScalars] = useState(() => new Scalars(Array.from({ length: 40 }, () => 30)));

    const [scrollX, setScrollX] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    let readyToUpdateYAxis = true;

    // data values
    const [tableData, setTableData] = useState(generateEmptyTable(sideBarHeight, topBarWidth))

    useEffect(() => {
        const handleScroll = (event: Event) => {
            const target = event.target as HTMLDivElement;

            // Update scrollX and scrollY using refs (no re-render)
            setScrollX(target.scrollLeft);
            setScrollY(target.scrollTop);

            const containerLeft = containerRef.current ? containerRef.current.offsetLeft : 0;
            const containerTop = containerRef.current ? containerRef.current.offsetTop : 0;

            // TODO: Fix the issue where when side scrolling the sidebar will peek through.

            if (topRef.current) {
                topRef.current.style.position = "fixed";
                topRef.current.style.left = `${containerLeft - target.scrollLeft}px`;
                topRef.current.style.top = `${containerTop}px`;
            }

            if (sideRef.current) {
                sideRef.current.style.position = "fixed";
                sideRef.current.style.left = `${containerLeft}px`;
                sideRef.current.style.top = `${containerTop + 30 - target.scrollTop}px`;
            }

            // handle expanding the canvas
            if (target.scrollLeft > (target.scrollWidth - target.clientWidth) / 1.25 && readyToUpdateXAxis) {
                setTopBarWidth(prevWidth => prevWidth + 10);
                setTableData(tableData.extendXDirection(10));
                setVerticalScalars(new Scalars(horizontalScalars.extend(Array(10).fill(80))));
                readyToUpdateXAxis = false;
            } else if (!readyToUpdateXAxis && target.scrollLeft < (target.scrollWidth - target.clientWidth) / 1.25) {
                readyToUpdateXAxis = true;
            }

            if (target.scrollTop > (target.scrollHeight - target.clientHeight) / 1.25 && readyToUpdateYAxis) {
                setSideBarHeight(prevWidth => prevWidth + 10);
                setTableData(tableData.extendYDirection(10))
                setVerticalScalars(new Scalars(verticalScalars.extend(Array(10).fill(50))));
                readyToUpdateYAxis = false;
            } else if (!readyToUpdateYAxis && target.scrollTop < (target.scrollHeight - target.clientHeight) / 1.25) {
                readyToUpdateYAxis = true;
            }
        };

        const tableContainer = tableContainerRef.current;
        if (tableContainer) {
            tableContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (tableContainer) {
                tableContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [readyToUpdateXAxis, readyToUpdateYAxis]);  // Add dependencies here to avoid stale closures

    return (
        <div
            className="canvasContainer"
            style={{

                // TODO: remove hard coded width and height values.

                position: "absolute",
                width: "100vw",
                height: "78vh", // Ensure full viewport height
                margin: 0, // Remove any default margin
                padding: 0, // Remove any padding
                boxSizing: "border-box", // Include padding and border in dimensions
                overflow: "hidden"
            }}
            ref={containerRef}
        >
            {/* Topbar positioned at the very top */}
            <Topbar
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "30px", // Matches topbarHeight
                    zIndex: 2,
                }}
                ref={topRef}
                horizontalScalars={horizontalScalars}
                width={topBarWidth}
                startingLetter={startingLetter}
            />

            {/* Sidebar positioned on the left */}
            <Sidebar
                style={{
                    position: "absolute",
                    top: "30px", // Below Topbar
                    left: 0,
                    zIndex: 1,
                }}
                ref={sideRef}
                verticalScalars={verticalScalars}
                height={sideBarHeight}
                startingNumber={startingNumber}
            />

            <div
                style={{
                    position: "absolute",
                    overflow: "scroll",
                    height: "75vh",
                    width: "94.8vw",
                    top: "30px",
                    left: "100px"
                }}
                ref={tableContainerRef}
            >
                <Table
                    style={{
                        top: "0",
                        left: "0",
                    }}
                    ref={tableRef} width={topBarWidth} height={sideBarHeight} scrollX={scrollX} scrollY={scrollY}
                    data={tableData}
                    verticalScalars={verticalScalars}
                    horizontalScalars={horizontalScalars}
                />
            </div>
        </div>
    );
};

export default TableContainer;
