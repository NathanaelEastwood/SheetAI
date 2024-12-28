import React, { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Table from "./Table";

interface TableCoordinates {
    topWhiteSpace: number;
    bottomWhiteSpace: number;
    leftWhiteSpace: number;
    rightWhiteSpace: number;
    firstColumnNumber: number;
    firstRowNumber: number;
}

const TableContainer: React.FC = () => {
    const [width, setWidth] = useState<number>(24);
    const [height, setHeight] = useState<number>(30);
    const [currentYOffset, setCurrentYOffset] = useState(0);
    const [currentXOffset, setCurrentXOffset] = useState(0);
    const yMovementSinceRegenerate = useRef(0);
    const tablePosition = useRef<TableCoordinates>({
        topWhiteSpace: 0,
        bottomWhiteSpace: 0,
        leftWhiteSpace: 0,
        rightWhiteSpace: 0,
        firstColumnNumber: 0,
        firstRowNumber: 0,
    });

    const isUpdating = useRef(false);

    const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (isUpdating.current) return; // Avoid feedback loop

        const scrollTop = event.currentTarget.scrollTop;
        const scrollHeight = event.currentTarget.scrollHeight;
        const clientHeight = event.currentTarget.clientHeight;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;

        const yMovement = scrollTop - currentYOffset;

        if (Math.abs(yMovement) < 10) {
            yMovementSinceRegenerate.current += yMovement;
        } else {
            yMovementSinceRegenerate.current = 0;

            // Avoid unnecessary updates
            if (scrollBottom < clientHeight / 2 || scrollTop < clientHeight / 2) {
                isUpdating.current = true;

                if (yMovement > 0) {
                    tablePosition.current.firstRowNumber -= yMovement / 10;
                    tablePosition.current.bottomWhiteSpace -= yMovement;
                    tablePosition.current.topWhiteSpace += yMovement;
                } else {
                    tablePosition.current.firstRowNumber += yMovement / 10;
                    tablePosition.current.topWhiteSpace -= yMovement;
                    tablePosition.current.bottomWhiteSpace += yMovement;
                }

                // Simulate async state update
                setTimeout(() => {
                    isUpdating.current = false;
                }, 10);
            }
        }

        setCurrentYOffset(scrollTop);
    };

    return (
        <Col
            xs={12}
            md={8}
            style={{
                overflowX: "scroll",
                overflowY: "scroll",
                height: "100%",
                width: "66%",
            }}
            onScroll={handleScroll}
        >
            <Table coordinates={tablePosition.current} width={width} height={height} />
        </Col>
    );
};

export default TableContainer;
