import {createSlice} from "@reduxjs/toolkit";
import generateEmptyTable from "./generateEmptyTable";

const globalTableData = createSlice({
    name: 'globalTableData',
    initialState: {
        value: generateEmptyTable(100, 40),
        selectedCell: "A1"
    },
    reducers: {
        updateGlobalTableData: (state, action) => {state.value = action.payload},
        updateSelectedCell: (state, action) => {state.selectedCell = action.payload}
    }
})

export const {updateGlobalTableData, updateSelectedCell} = globalTableData.actions;
export default globalTableData.reducer;