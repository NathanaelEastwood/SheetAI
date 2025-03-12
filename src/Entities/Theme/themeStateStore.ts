import {createSlice} from "@reduxjs/toolkit";

const globalDarkMode = createSlice({
    name: "themeState",
    initialState: true,
    reducers: {
            toggleDarkMode: (state) => !state
    }
})

export const {toggleDarkMode} = globalDarkMode.actions;
export default globalDarkMode.reducer;