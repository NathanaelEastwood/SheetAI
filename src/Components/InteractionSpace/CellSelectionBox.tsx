import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../main";
import { getLetterFromNumber } from "../../Entities/General/HelperFunctions";

const CellSelectionBox: React.FC = () => {
    const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell);

    return (
        <div style={{
            position: "relative",
            top: -30,
            height: '30px',
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#333",
            userSelect: "none",
        }}>
            <span style={{
                color: "#2c5282",
                fontWeight: 600,
                marginRight: "2px"
            }}>
                {getLetterFromNumber(selectedCell[0] + 1)}
            </span>
            <span>
                {selectedCell[1] + 1}
            </span>
        </div>
    );
};

export default CellSelectionBox;