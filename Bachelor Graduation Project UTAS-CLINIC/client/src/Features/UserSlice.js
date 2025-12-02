import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// Initial State
const initialState = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// Async Thunks

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ENV.SERVER_URL}/registerUser`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/login`, {
        email: userData.email,
        password: userData.password,
      });
      return response.data.user;
    } catch (error) {
      alert("Invalid credentials");
      return rejectWithValue("Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${ENV.SERVER_URL}/logout`);
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

// Slice

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Register by the admin
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = {};
        state.isLoading = false;
        state.isSuccess = false;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
