import React from "react";

interface CellSelectionBoxProps {
    cellName: string;
}

const CellSelectionBox: React.FC<CellSelectionBoxProps> = ({ cellName }) => {
    return (
        <div style={{
            borderWidth: "1px",
            borderColor: "black",
            borderStyle: "solid",
        }}>
            {cellName}
        </div>
    );
};

export default CellSelectionBox;
