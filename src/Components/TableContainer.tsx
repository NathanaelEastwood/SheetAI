import React, { useEffect, useRef } from "react";
import Table from "../Components/Table";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TableContainer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && tableRef.current) {
            const container = containerRef.current;
            const table = tableRef.current;

            // Dimensions for Topbar and Sidebar
            const sidebarWidth = 200; // Adjust to match Sidebar width
            const topbarHeight = 50; // Adjust to match Topbar height

            // Calculate available space for the Table
            const availableWidth = container.offsetWidth - sidebarWidth;
            const availableHeight = container.offsetHeight - topbarHeight;

            // Resize and center the Table dynamically
            table.style.width = `${availableWidth * 0.6}px`; // 60% of available width
            table.style.height = `${availableHeight * 0.6}px`; // 60% of available height
            table.style.position = "absolute";
            table.style.left = `${(availableWidth - table.offsetWidth) / 2}px`;
            table.style.top = `${(availableHeight - table.offsetHeight) / 2 + topbarHeight}px`;
        }
    }, []);

    return (
        <div
            className="canvasContainer"
            style={{
                position: "absolute",
                width: "100vw",
                height: "100vh", // Ensure full viewport height
                margin: 0, // Remove any default margin
                padding: 0, // Remove any padding
                boxSizing: "border-box", // Include padding and border in dimensions
            }}
            ref={containerRef}
        >
            {/* Topbar positioned at the very top */}
            <Topbar
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "50px", // Matches topbarHeight
                    zIndex: 1,
                }}
            />

            {/* Sidebar positioned on the right */}
            <Sidebar
                style={{
                    position: "absolute",
                    top: "50px", // Below Topbar
                    left: 0,
                    width: "100px", // Matches sidebarWidth
                    height: "calc(100vh - 50px)", // Full height minus Topbar
                    zIndex: 1,
                }}
            />

            {/* Table dynamically sized and centered */}
            <div ref={tableRef}>
                <Table />
            </div>
        </div>
    );
};

export default TableContainer;
