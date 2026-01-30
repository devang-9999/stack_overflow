"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface SignupPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  user: User | null;
}


const initialState: AuthState = {
  loading: false,
  error: null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
};

const API_URL = "http://localhost:5000";


export const signupThunk = createAsyncThunk("auth/signup", async (data :SignupPayload, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/users/signup`, data);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
    return rejectWithValue("Signup failed");
  }
});


export const loginThunk = createAsyncThunk("auth/login", async (data:LoginPayload, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, data);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
    return rejectWithValue("Login failed");
  }
});


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Signup failed";
      })

      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
