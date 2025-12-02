import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// Define the initial state
const initialState = {
  allUsers: [], // Array to store user data
  isLoading: false,
  isSuccess: false,
  isError: false, // To store any error messages
};

// getUsers
export const getUsers = createAsyncThunk("manageUser/getUsers", async () => {
  try {
    const response = await axios.get(`${ENV.SERVER_URL}/getUsers`);
    return response.data.users;
  } catch (error) {
    console.error(error);
  }
});

// deleteUser
export const deleteUser = createAsyncThunk(
  "manageUser/deleteUser",
  async (id) => {
    try {
      await axios.delete(`${ENV.SERVER_URL}/deleteUser/${id}`);
      return id;
    } catch (error) {
      console.error(error);
      throw error; // Pass the error to the rejected state
    }
  }
);

// Create the slice
export const manageUserSlice = createSlice({
  name: "allUsers", // Name of the state
  initialState, // Use the initialState variable
  reducers: {
    reset: () => initialState, // Reset the state to its initial values
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = action.payload; // Update the state with fetched users
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.iserror = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.allUsers = state.allUsers.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.iserror = action.error.message;
      });
  },
});

// Export the reset action
export const { reset } = manageUserSlice.actions;

// Export the reducer
export default manageUserSlice.reducer;
