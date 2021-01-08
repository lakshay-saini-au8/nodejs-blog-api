import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchmea = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

userSchmea.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchmea.methods.matchPassword = async function (enteredPassword) {
  console.log(this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchmea);

export default User;
