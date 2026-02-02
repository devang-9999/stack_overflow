"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import questionReducer from "./questionsSlice";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import storage from "./persistStorage";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  auth: authReducer,
  question: questionReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
