import React, {useCallback, useEffect, useRef, useState} from "react";
import Table from "./Table";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {Scalars} from "../../Entities/Table/Scalars";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../main";
import {updateGlobalTableData} from "../../Entities/Table/globalStateStore";
import useWindowDimensions from "../../Entities/General/getWindowDimensions";

const TableContainer: React.FC = () => {

    // Window dimension hook
    const { windowHeight, windowWidth } = useWindowDimensions();

    const dispatch = useDispatch();

    const darkModeState: boolean = useSelector((state: RootState) => state.globalDarkMode);
    const rows = Math.ceil(windowHeight / 30);
    const cols = Math.ceil(windowWidth / 80);

    const tableData = useSelector((state: RootState) => state.globalTableData.value);

    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLCanvasElement>(null);
    const topRef = useRef<HTMLCanvasElement>(null);
    const sideRef = useRef<HTMLCanvasElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // top bar values
    const [startingLetter, setStartingLetter] = useState(0);
    const [topBarWidth, setTopBarWidth] = useState(cols);
    const [horizontalScalars, setHorizontalScalars] = useState<Scalars>(() => new Scalars(Array.from({ length: cols }, () => 80)));

    // sidebar values
    const [startingNumber, setStartingNumber] = useState(1);
    const [sideBarHeight, setSideBarHeight] = useState(rows);
    const [verticalScalars, setVerticalScalars] = useState(() => new Scalars(Array.from({ length: rows }, () => 30)));

    const [scrollX, setScrollX] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    const horizontalAdjustCallback = useCallback((index: number, distance: number) => {
        setHorizontalScalars(prevScalars => new Scalars(prevScalars.shiftValue(index, distance)));
    }, []);

    const verticalAdjustCallback = useCallback((index: number, distance: number) => {
        setVerticalScalars(prevState => new Scalars(prevState.shiftValue(index, distance)));
    }, []);

    useEffect(() => {
        const tableContainer = tableContainerRef.current;
        if (tableContainer) {
            tableContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (tableContainer) {
                tableContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [topBarWidth, sideBarHeight]);  // Add dependencies here to avoid stale closures

    useEffect(() => {
        if (windowWidth/80 > topBarWidth) {
            const required_increase = Math.ceil(windowWidth/80) - topBarWidth;

            setTopBarWidth(prevWidth => prevWidth + required_increase);
            dispatch(updateGlobalTableData(tableData.extendXDirection(required_increase)));
            setHorizontalScalars(new Scalars(horizontalScalars.extend(Array(required_increase).fill(80))));
        }

        if (windowHeight/30 > sideBarHeight) {
            const required_increase = Math.ceil(windowHeight/30) - sideBarHeight;

            setSideBarHeight(prevWidth => prevWidth + required_increase);
            dispatch(updateGlobalTableData(tableData.extendYDirection(required_increase)))
            setVerticalScalars(new Scalars(verticalScalars.extend(Array(required_increase).fill(30))));
        }
    }, [windowWidth, windowHeight]);

    const handleScroll = (event: Event) => {
        const target = event.target as HTMLDivElement;

        // Update scrollX and scrollY using refs (no re-render)
        setScrollX(target.scrollLeft);
        setScrollY(target.scrollTop);

        const containerLeft = containerRef.current ? containerRef.current.offsetLeft : 0;
        const containerTop = containerRef.current ? containerRef.current.offsetTop : 0;

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
        if (target.scrollLeft > (target.scrollWidth - target.clientWidth) / 1.4) {
            setTopBarWidth(prevWidth => prevWidth + 5);
            dispatch(updateGlobalTableData(tableData.extendXDirection(5)));
            setHorizontalScalars(new Scalars(horizontalScalars.extend(Array(4).fill(80))));
        }

        if (target.scrollTop > (target.scrollHeight - target.clientHeight) / 1.25) {
            setSideBarHeight(prevWidth => prevWidth + 10);
            dispatch(updateGlobalTableData(tableData.extendYDirection(10)))
            setVerticalScalars(new Scalars(verticalScalars.extend(Array(10).fill(30))));
        }
    };

    return (
        <div
            className="canvasContainer"
            style={{
                // TODO: remove hard coded width and height values.
                position: "absolute",
                width: "100vw",
                height: "calc(100vh - 200px)", // Ensure full viewport height
                margin: 0, // Remove any default margin
                padding: 0, // Remove any padding
                boxSizing: "border-box", // Include padding and border in dimensions
                overflow: "hidden",
                clipPath: "inset(0 0 0 0)"
            }}
            ref={containerRef}
        >
            {/* Blanking cell to hide objects moving through */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "30px",
                    width: "100px",
                    backgroundColor: darkModeState ? "#f8f9fa": "#070605", // Light gray background
                    border: darkModeState ? "1px solid #e0e0e0" : "1px solid #1f1f1f", // Soft gray border
                    boxShadow: darkModeState ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "0 1px 3px rgba(255, 255, 255, 0.1)", // Subtle shadow
                    borderRadius: "4px", // Slight rounding
                    zIndex: 99,
                }}
            />
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
                scrollX={scrollX}
                scrollY={scrollY}
                adjustScalars={horizontalAdjustCallback}
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
                scrollY={scrollY}
                adjustScalars={verticalAdjustCallback}
            />

            <div
                style={{
                    position: "absolute",
                    overflow: "scroll",
                    height: "calc(100vh - 230px)",
                    width: "calc(100vw - 100px)",
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
                    verticalScalars={verticalScalars}
                    horizontalScalars={horizontalScalars}
                />
            </div>
        </div>
    );
};

export default TableContainer;
