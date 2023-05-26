import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { alertsSlice } from "./alertsSlice";
import { userSlice } from "./userSlice";
import { serverStatusSlice } from "./serverStatusSlice";

const rootReducer = combineReducers({
    alerts: alertsSlice.reducer,
    user: userSlice.reducer,
    serverStatus: serverStatusSlice.reducer
});

const store = configureStore({
    reducer: rootReducer,
});
export default store;
