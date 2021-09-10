import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { TabName, TabPosition } from "./dock-properties";


interface DockSideState {
    all: TabName[],
    stack: TabName[]
}

type DockState = {
    [TabPosition.Left]: DockSideState,
    [TabPosition.Bottom]: DockSideState,
    [TabPosition.Right]: DockSideState,
    [TabName.Monitor]: TabPosition,
    [TabName.Data]: TabPosition,
    [TabName.Sequence]: TabPosition,
    [TabName.Plot]: TabPosition,
    [TabName.Alert]: TabPosition
};

const initialState: DockState = {
    [TabPosition.Left]:     { all: [], stack: [] },
    [TabPosition.Bottom]:   { all: [], stack: [] },
    [TabPosition.Right]:    { all: [], stack: [] },
    [TabName.Monitor]:  TabPosition.Bottom,
    [TabName.Data]:     TabPosition.Bottom,
    [TabName.Sequence]: TabPosition.Bottom,
    [TabName.Plot]:     TabPosition.Bottom,
    [TabName.Alert]:     TabPosition.Bottom
};

function openTabReducer(state: Draft<DockState>, tabName: TabName) {
    const position = state[tabName];
    const index = state[position].stack.indexOf(tabName);
    if (index >= 0) {
        state[position].stack.splice(index, 1);
        state[position].stack.unshift(tabName);
    } else {
        state[position].all.unshift(tabName);
        state[position].stack.unshift(tabName);
    }
}

function closeTabReducer(state: Draft<DockState>, tabName: TabName) {
    const position = state[tabName];
    const index = state[position].stack.indexOf(tabName);
    if (index < 0) return;
    state[position].all = state[position].all.filter(item => item !== tabName);
    state[position].stack = state[position].stack.filter(item => item !== tabName);
}

function isTabOpen(state: Draft<DockState>, tabName: TabName) {
    return [state.left.stack[0], state.bottom.stack[0], state.right.stack[0]].indexOf(tabName) >= 0;
}

const dockSlice = createSlice({
    name: "dock",
    initialState,
    reducers: {
        openTab: (state, action: PayloadAction<TabName>) => {
            openTabReducer(state, action.payload);
        },
        closeTab: (state, action: PayloadAction<TabName>) => {
            closeTabReducer(state, action.payload);
        },
        toggleTab: (state, action: PayloadAction<TabName>) => {
            if (isTabOpen(state, action.payload)) {
                closeTabReducer(state, action.payload);
            } else {
                openTabReducer(state, action.payload);
            }
        },
        closeAll: (state, action: PayloadAction<TabPosition>) => {
            state[action.payload].all = [];
            state[action.payload].stack = [];
        },
        moveTab: (state, action: PayloadAction<{ tab: TabName, newPosition: TabPosition }>) => {
            closeTabReducer(state, action.payload.tab);
            state[action.payload.tab] = action.payload.newPosition;
            openTabReducer(state, action.payload.tab);
        },
    },
});

export const {
    openTab,
    closeTab,
    toggleTab,
    closeAll,
    moveTab
} = dockSlice.actions;

export default dockSlice.reducer;

export const selectDockState = (state: RootState) =>
    state.dock;

export const selectLeftDock = (state: RootState) =>
    state.dock.left;

export const selectBottomDock = (state: RootState) =>
    state.dock.bottom;

export const selectRightDock = (state: RootState) =>
    state.dock.right;

export const selectLeftDockNonEmpty = (state: RootState) =>
    state.dock.left.all.length > 0;

export const selectBottomDockNonEmpty = (state: RootState) =>
    state.dock.bottom.all.length > 0;

export const selectRightDockNonEmpty = (state: RootState) =>
    state.dock.right.all.length > 0;
