import React, {useEffect, useRef, useState} from "react";
import Table from "../Components/Table";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TableContainer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLCanvasElement>(null);
    const topRef = useRef<HTMLCanvasElement>(null);
    const sideRef = useRef<HTMLCanvasElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // top bar values
    const [startingLetter, setStartingLetter] = useState(0);
    const [topBarWidth, setTopBarWidth] = useState(40);
    let readyToUpdateXAxis = true;

    // sidebar values
    const [startingNumber, setStartingNumber] = useState(0);
    const [sideBarHeight, setSideBarHeight] = useState(100);
    let readyToUpdateYAxis = true;

    useEffect(() => {
        const handleScroll = (event: Event) => {
            const target = event.target as HTMLDivElement;
            const scrollX = target.scrollLeft; // Horizontal scroll position
            const scrollY = target.scrollTop;  // Vertical scroll position

            const containerLeft = containerRef.current ? containerRef.current.offsetLeft : 0;
            const containerTop = containerRef.current ? containerRef.current.offsetTop : 0;

            // TODO: Fix the issue where when side scrolling the sidebar will peek through.

            if(topRef.current) {
                topRef.current.style.position = "fixed";
                topRef.current.style.left = `${containerLeft - scrollX}px`;  // Added 'px'
                topRef.current.style.top = `${containerTop}px`;    // Added 'px'
            }

            if(sideRef.current) {
                sideRef.current.style.position = "fixed";
                sideRef.current.style.left = `${containerLeft}px`; // Added 'px'
                sideRef.current.style.top = `${containerTop + 30 - scrollY}px`; // Added 'px'
            }

            // handle expanding the canvas

            if (scrollX > (target.scrollWidth - target.clientWidth) / 1.25 && readyToUpdateXAxis) {
                setTopBarWidth(prevWidth => prevWidth + 10);
                readyToUpdateXAxis = false;
            } else if (!readyToUpdateXAxis && scrollX < (target.scrollWidth - target.clientWidth) / 1.25){
                readyToUpdateXAxis = true;
            }

            if (scrollY > (target.scrollHeight - target.clientHeight) / 1.1 && readyToUpdateYAxis) {
                setSideBarHeight(prevWidth => prevWidth + 30);
                readyToUpdateYAxis = false;
            } else if (!readyToUpdateYAxis && scrollY < (target.scrollHeight - target.clientHeight) / 1.1){
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
    }, []);

    return (
            // TODO: Tie up all size measurements to be derived from a single point.
            <div
                className="canvasContainer"
                style={{
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
                    ref = {topRef}
                    width={topBarWidth}
                    startingLetter={startingLetter}
                />

                {/* Sidebar positioned on the left */}
                <Sidebar
                    style={{
                        position: "absolute",
                        top: "30px", // Below Topbar
                        left: 0,
                        width: "100px", // Matches sidebarWidth
                        zIndex: 1,
                    }}
                    ref = {sideRef}
                    height = {sideBarHeight}
                    startingNumber={startingNumber}
                />

                <div style={{
                    // TODO: Fix height and width specifics here so container naturally fills viewport.
                    position: "absolute",
                    overflow: "scroll",
                    height: "75vh",
                    width: "94.8vw",
                    top: "30px",
                    left: "100px"
                }}
                 ref={tableContainerRef}>
                    <Table
                        style={{
                            top: "0",
                            left: "0"
                        }}
                        ref={tableRef} width={topBarWidth} height={sideBarHeight}
                    />
                </div>
            </div>
    );
};

export default TableContainer;

