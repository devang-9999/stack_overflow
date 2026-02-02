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
  uid?: string;
  id: number;
  email: string;
  authType: "custom" | "firebase" | null;

}

interface AuthState {
  loading: boolean;
  error: string | null;
  user: User | null;

}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
};

const API_URL = "http://localhost:5000";

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data: SignupPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/users/signup`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Signup failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/users/login`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          authType: "custom",
        };
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = {
          ...action.payload,
          authType: "custom",
        };
      });

  },
});

export const { logout, clearUser, setUser } = authSlice.actions;
export default authSlice.reducer;
