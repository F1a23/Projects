import mongoose from "mongoose";

const AppointmentModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  serviceType: { type: String, required: true },
});
const AppointmentModel = mongoose.model("Appointment", AppointmentModelSchema);

export default AppointmentModel;
