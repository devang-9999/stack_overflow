/* eslint-disable @typescript-eslint/no-explicit-any */
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
  userPublished: Question[];
  userDrafts: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  userDrafts: [],
  userPublished: [],
  question: null,
  loading: false,
  error: null,
};

const API_URL = "http://localhost:5000";

export const fetchQuestionsThunk = createAsyncThunk(
  "questions/fetchAll",
  async (
    params?: { search?: string; tags?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(`${API_URL}/questions`, {
        params: {
          search: params?.search,
          tags: params?.tags?.join(","),
        },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch questions"
      );
    }
  }
);


export const fetchQuestionsThunkById = createAsyncThunk(
  "questions/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      console.log(id, "fksdfsdghnfsldfhsdhfc")
      const res = await axios.get(`${API_URL}/questions/${id}`);

      return res.data;

    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch questions");
    }
  }
);

export const addQuestionThunk = createAsyncThunk(
  "questions/add",

  async (data: any, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/questions`, data);
      return res.data; // This should return the newly created question object

    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to add question");
    }
  }
);

export const fetchUserPublishedThunk = createAsyncThunk(
  "questions/userPublished",
  async (userId: number) => {
    const res = await axios.get(
      `http://localhost:5000/questions/user/${userId}/published`
    );
    console.log(res)
    return res.data;
  }
);

export const fetchUserDraftsThunk = createAsyncThunk(
  "questions/userDrafts",
  async (userId: number) => {
    const res = await axios.get(
      `http://localhost:5000/questions/user/${userId}/drafts`
    );
    console.log(res)
    return res.data;
  }
);

export const updateQuestionStatusThunk = createAsyncThunk(
  "questions/updateStatus",
  async (
    {
      questionId,
      userId,
      status,
    }: { questionId: number; userId: number; status: "draft" | "published" },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/questions/${questionId}/status`,
        { userId, status }
      );

       console.log(res.data)
      return res.data;
     
    } catch (err: any) {
      return rejectWithValue(err.response.data);
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
        console.log("fulfilled", action.payload)
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
        console.log("fulfilled", action.payload);
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
      })
      .addCase(fetchUserPublishedThunk.fulfilled, (state, action) => {
        state.userPublished = action.payload;
      })

      .addCase(fetchUserDraftsThunk.fulfilled, (state, action) => {
        state.userDrafts = action.payload;
      })
      .addCase(updateQuestionStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.userDrafts = state.userDrafts.filter(
          (q: any) => q.id !== updated.id
        );
        state.userPublished = state.userPublished.filter(
          (q: any) => q.id !== updated.id
        );
        if (updated.status === "draft") {
          state.userDrafts.unshift(updated);
        } else {
          state.userPublished.unshift(updated);
        }
      })



  },
});

export default questionSlice.reducer;