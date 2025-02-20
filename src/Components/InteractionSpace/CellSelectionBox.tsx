import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../main";
import {getLetterFromNumber} from "../../Entities/General/HelperFunctions";

const CellSelectionBox: React.FC = () => {

    const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell)

    return (
        <div style={{
            borderWidth: "1px",
            borderColor: "black",
            borderStyle: "solid",
        }}>
            {getLetterFromNumber(selectedCell[0] + 1)}{selectedCell[1] + 1}
        </div>
    );
};

export default CellSelectionBox;
