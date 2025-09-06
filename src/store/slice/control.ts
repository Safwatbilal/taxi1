import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {
    openSideBar: boolean;
}

const initialState: initialStateProps = {
    openSideBar: false,
};

const slice = createSlice({ 
    name: "control",
    initialState,
    reducers: {
        updateControlState: (
        state,
        action: PayloadAction<{ key: keyof initialStateProps; payload: any }>
        ) => {
        const { key, payload } = action.payload;
        (state as any)[key] = payload;
        },
    },
});

export default slice.reducer;
export const { updateControlState } = slice.actions;
