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

            // Dynamically size and center the Table
            const sidebarWidth = 200; // Adjust this value to match Sidebar width
            const topbarHeight = 50; // Adjust this value to match Topbar height

            const availableWidth = container.offsetWidth - sidebarWidth;
            const availableHeight = container.offsetHeight - topbarHeight;

            table.style.width = `${availableWidth * 0.6}px`; // Adjust Table width to 60% of available space
            table.style.height = `${availableHeight * 0.6}px`; // Adjust Table height to 60% of available space
            table.style.position = "absolute";
            table.style.left = `${(availableWidth - table.offsetWidth) / 2}px`;
            table.style.top = `${(availableHeight - table.offsetHeight) / 2 + topbarHeight}px`;
        }
    }, []);

    return (
        <div
            className="canvasContainer"
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                paddingLeft: 0,
            }}
            ref={containerRef}
        >
            <Topbar />
            <Sidebar />
            <div ref={tableRef}>
                <Table />
            </div>
        </div>
    );
};

export default TableContainer;
