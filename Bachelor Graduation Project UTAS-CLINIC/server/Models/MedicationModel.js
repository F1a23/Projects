import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  contactNo: String,
  selectedMedications: [Number],
  medications: [
    {
      name: String,
      quantity: Number,
    },
  ],
  deliveryMethod: String,
  deliveryDetails: {
    buildingName: String,
    buildingNumber: String,
    roomNumber: String,
  },
});

// إنشاء الـ Model
const MedicationModel = mongoose.model("Medication", medicationSchema);

export default MedicationModel;
