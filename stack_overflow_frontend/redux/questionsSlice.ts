"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Tag {
  id: number;
  name: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
  tags: Tag[] | string[];
  user: { id: string; name?: string };
}

interface QuestionsState {
  question: Question | null;
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  question: null,
  loading: false,
  error: null,
};

const API_URL = "http://localhost:5000";

export const fetchQuestionsThunk = createAsyncThunk(
  "questions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/questions`);
      return res.data; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch questions");
    }
  }
);


export const fetchQuestionsThunkById = createAsyncThunk(
  "questions/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      console.log(id,"fksdfsdghnfsldfhsdhfc")
      const res = await axios.get(`${API_URL}/questions/${id}`);
      
      return res.data; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch questions");
    }
  }
);

export const addQuestionThunk = createAsyncThunk(
  "questions/add",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: any, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/questions`, data);
      return res.data; // This should return the newly created question object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to add question");
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Fetch Questions */
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        console.log("fulfilled",action.payload)
        state.questions = action.payload;
        console.log(state.questions);
      })
      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuestionsThunkById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsThunkById.fulfilled, (state, action: PayloadAction<Question>) => {
        state.loading = false;
        console.log("fulfilled",action.payload);
        state.question = action.payload;
        console.log(state.question);
      })
      .addCase(fetchQuestionsThunkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
 
      .addCase(addQuestionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addQuestionThunk.fulfilled, (state, action: PayloadAction<Question>) => {
        state.loading = false;
        state.questions.unshift(action.payload); 
      })
      .addCase(addQuestionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default questionSlice.reducer;