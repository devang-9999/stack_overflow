"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface QuestionPayload {
  title: string;
  description: string;
  type: string;
  tags: string[];
}

interface QuestionState {
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addQuestionThunk = createAsyncThunk(
  "questions/add",
  async (data: QuestionPayload, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/questions`, data);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to add question");
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addQuestionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addQuestionThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addQuestionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default questionSlice.reducer;
