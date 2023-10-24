import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  salt: Buffer,
  hashed_password: Buffer,
});

const User = new mongoose.model("User", userSchema);

export { User };
