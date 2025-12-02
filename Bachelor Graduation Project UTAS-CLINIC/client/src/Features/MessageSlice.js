import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// Initial state
const initialState = {
  userMessages: [], // To store messages
  status: "idle", // Loading state
  error: null, // Error state
};

export const saveUserMsg = createAsyncThunk(
  "userMessages/saveUserMsg",
  async (userMsgData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/saveUserMsg`, {
        name: userMsgData.name,
        email: userMsgData.email,
        userMsg: userMsgData.userMsg,
      });
      return response.data.usermessage; // Corrected to usermessage
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to get all user messages
export const getUserMsgs = createAsyncThunk(
  "userMessages/getUserMsgs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/getUserMsg`);
      return response.data.usermessages; // Correct response structure
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// User message slice
const MessageSlice = createSlice({
  name: "userMessages",
  initialState,
  reducers: {
    reset: () => initialState, // Reset the state
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserMsg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveUserMsg.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userMessages.push(action.payload); // Add new message
      })
      .addCase(saveUserMsg.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error
      })
      .addCase(getUserMsgs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserMsgs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userMessages = action.payload; // Update user messages
      })
      .addCase(getUserMsgs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error
      });
  },
});

export const { reset } = MessageSlice.actions;
export default MessageSlice.reducer;
