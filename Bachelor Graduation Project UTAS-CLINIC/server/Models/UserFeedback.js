import mongoose from "mongoose";

const UserFeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Anonymous" },
    email: { type: String, default: "" },
    rating: { type: Number, required: true },
    feedbackMsg: { type: String, required: true },
  },
  { timestamps: true }
);

const UserFeedback = mongoose.model("Feedback", UserFeedbackSchema);
export default UserFeedback;
