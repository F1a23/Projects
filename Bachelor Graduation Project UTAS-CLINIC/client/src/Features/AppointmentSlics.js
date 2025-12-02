import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  appointments: [], // لتخزين المواعيد
  status: "idle", // حالة التحميل
  error: null, // حالة الخطأ
};

//new appointment
export const saveAppointment = createAsyncThunk(
  "appointments/saveAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/saveAppointment", appointmentData);
      if (response.status === 200 && response.data.Appointment) {
        return response.data;
      }
      throw new Error("Failed to save appointment");
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

//get all appointments
export const getAppointments = createAsyncThunk(
  "appointments/getAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/getAppointments");
      if (response.status === 200 && response.data.Appointments) {
        return response.data.Appointments;
      }
      throw new Error("Failed to fetch appointments");
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// إنشاء الـ Slice
const AppointmentSlics = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(saveAppointment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveAppointment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appointments.push(action.payload.Appointment); // إضافة الموعد الجديد إلى قائمة المواعيد
      })
      .addCase(saveAppointment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset } = AppointmentSlics.actions;
export default AppointmentSlics.reducer;
