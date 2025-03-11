import {createSlice} from "@reduxjs/toolkit";

const globalDarkMode = createSlice({
    name: "themeState",
    initialState: false,
    reducers: {
            toggleDarkMode: (state) => !state
    }
})

export const {toggleDarkMode} = globalDarkMode.actions;
export default globalDarkMode.reducer;