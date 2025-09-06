import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import control from './slice/control'
import { store } from "./store";
const rootPersistConfig = {
    key: "root",
    storage,
    keyPrefix: "redux-",
    whitelist: [""],
  };
  
const controlPersistConfig = {
    key: "control",
    storage,
    keyPrefix: "redux-",
    whitelist: ["permissions","lang"],
  };
const controlPersistConfigState = {
    key: "sidebar",
    storage,
    keyPrefix: "redux-",
    whitelist: ["permissions","state"],
  };
const cartPersistConfigState = {
    key: "cart",
    storage,
    keyPrefix: "redux-",
    whitelist: ["permissions","state"],
  };
const rootReducer=combineReducers({
  control:persistReducer(controlPersistConfig,control),
})
export {rootReducer,rootPersistConfig}
export type IRootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
