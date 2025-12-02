import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  feedbacks: [],
  status: "idle",
  error: null,
};

export const saveFeedback = createAsyncThunk(
  "feedbacks/saveFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/saveFeedback`, {
        name: feedbackData.name,
        email: feedbackData.email,
        rating: feedbackData.rating,
        feedbackMsg: feedbackData.feedbackMsg,
      });
      return response.data.feedback; // Return saved feedback
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch all feedbacks
export const getFeedbacks = createAsyncThunk(
  "feedbacks/getFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/getFeedbacks`);
      return response.data.feedbacks; // Return list of feedbacks
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Redux slice for feedback
const FeedbackSlice = createSlice({
  name: "feedbacks",
  initialState: initialState,
  reducers: {
    reset: () => initialState, // Reset feedback state
  },
  extraReducers: (builder) => {
    builder
      // Handle saving feedback
      .addCase(saveFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks.unshift(action.payload); // Add new feedback to list
      })
      .addCase(saveFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message
      })

      // Handle fetching feedbacks
      .addCase(getFeedbacks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks = action.payload; // Update feedback list
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message
      });
  },
});

export const { reset } = FeedbackSlice.actions;
export default FeedbackSlice.reducer;
