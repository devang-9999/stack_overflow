"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface RegisterPayload {
  useremail: string;
  userPassword: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  userid: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  loading: false,
  success: false,
  error: null,
  message: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
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
      state.token = null;
      state.user = null;
      state.success = false;
      state.error = null;
      state.message = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = "Registration successful";
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = action.payload as string;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.message = "Login successful";
        localStorage.setItem("token", action.payload.access_token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = action.payload as string;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;