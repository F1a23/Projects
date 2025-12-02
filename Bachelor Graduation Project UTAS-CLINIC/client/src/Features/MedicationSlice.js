import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

export const saveUserMedication = createAsyncThunk(
  "medication/saveUserMedication",
  async (medicationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ENV.SERVER_URL}/saveUserMedication`,
        medicationData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Unexpected error occurred" }
      );
    }
  }
);

const medicationSlice = createSlice({
  name: "medication",
  initialState: {
    userMedication: null,
    loading: false,
    error: "",
    successMessage: "",
  },
  reducers: {
    resetState: (state) => {
      state.userMedication = null;
      state.loading = false;
      state.error = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserMedication.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(saveUserMedication.fulfilled, (state, action) => {
        state.loading = false;
        state.userMedication = action.payload.userMedication;
        state.successMessage = action.payload.msg;
      })
      .addCase(saveUserMedication.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error || "Failed to save medication summary.";
      });
  },
});

export const { resetState } = medicationSlice.actions;

export default medicationSlice.reducer;
