import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  civilNumber: {
    type: String,
    required: true,
    match: [/^\d{8}$/, "Civil Number must be 8 digits"],
  },
  birthDate: {
    type: Date,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
    match: [/^[7-9]\d{7}$/, "Contact No must be 8 digits starting with 7 or 9"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^([a-zA-Z0-9._%+-]+)@utas\.edu\.om$/,
      "Email must be a valid UTAS email address",
    ],
  },
  department: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["Admin", "User", "Nurse"],
    default: "User",
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

// ✅ لاحظ هنا أني أضفت "userinfos" كاسم المجموعة في النهاية
const UserModel = mongoose.model("User", UserSchema, "userinfos");

export default UserModel;
