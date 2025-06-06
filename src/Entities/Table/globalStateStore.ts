import {createSlice} from "@reduxjs/toolkit";
import generateEmptyTable from "./generateEmptyTable";

const globalTableData = createSlice({
    name: 'globalTableData',
    initialState: {
        value: generateEmptyTable(200, 80),
        selectedCell: [0, 0],
        selectedCellsBottomRight: [0, 0]
    },
    reducers: {
        updateGlobalTableData: (state, action) => {state.value = action.payload},
        updateSelectedCell: (state, action) => {state.selectedCell = action.payload},
        updateSelectedCellsBottomRight: (state, action) => {state.selectedCellsBottomRight = action.payload}
    }
})

export const {updateGlobalTableData, updateSelectedCell, updateSelectedCellsBottomRight} = globalTableData.actions;
export default globalTableData.reducer;