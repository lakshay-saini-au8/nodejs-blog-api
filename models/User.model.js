import mongoose from "mongoose";

const userSchmea = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
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
    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchmea);
export default User;
