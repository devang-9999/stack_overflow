"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import questionReducer from "./questionsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    question:questionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;