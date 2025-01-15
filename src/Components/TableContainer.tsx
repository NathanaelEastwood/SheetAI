import React, {useEffect, useRef, useState} from "react";
import Table from "../Components/Table";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import sidebar from "./Sidebar";

const TableContainer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLCanvasElement>(null);
    const topRef = useRef<HTMLCanvasElement>(null);
    const sideRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            const target = event.target as HTMLDivElement;
            const scrollX = target.scrollLeft; // Horizontal scroll position
            const scrollY = target.scrollTop;  // Vertical scroll position
            const containerLeft = containerRef.current.offsetLeft || 0;
            const containerTop = containerRef.current.offsetTop || 0;

            console.log(containerLeft, containerTop);

            // TODO: Fix the issue where scrolling both X and Y directions, causes one scroll bar to snap back.

            if (scrollY !== 0 && topRef.current) {
                topRef.current.style.position = "fixed";
                topRef.current.style.left = `${containerLeft}px`;  // Added 'px'
                topRef.current.style.top = `${containerTop}px`;    // Added 'px'
            } else if (topRef.current) {
                topRef.current.style.position = "absolute";
                topRef.current.style.left = "0px";  // Reset left
                topRef.current.style.top = "0px";   // Reset top

            }

            if (scrollX !== 0 && sideRef.current) {
                sideRef.current.style.position = "fixed";
                sideRef.current.style.left = `${containerLeft}px`;  // Added 'px'
                sideRef.current.style.top = `${containerTop + 30}px`;    // Added 'px'
            } else if (sideRef.current) {
                sideRef.current.style.position = "absolute";
                sideRef.current.style.left = "0px";  // Reset left
                sideRef.current.style.top = "30px";   // Reset top
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);


    return (
            <div
                className="canvasContainer"
                style={{
                    position: "absolute",
                    width: "100vw",
                    height: "78vh", // Ensure full viewport height
                    margin: 0, // Remove any default margin
                    padding: 0, // Remove any padding
                    boxSizing: "border-box", // Include padding and border in dimensions
                    overflow: "scroll"
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
                        zIndex: 1,
                    }}
                    ref = {topRef}
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
                />

                {/* Table dynamically sized and centered */}
                {/*<div ref={tableRef}>
                    <Table />
                </div>*/}
                <Table
                    style={{
                        height: "1000px",
                        width: "1950px",
                        top: "0",
                        left: "0"
                    }}
                    ref={tableRef} width={24} height={30} />
            </div>
    );
};

export default TableContainer;

