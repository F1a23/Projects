import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "user.png",
  },
  userType: {
    type: String,
    default: "user",
  },
});

const UserModel = mongoose.model("userinfos", UserSchema);

export default UserModel;
