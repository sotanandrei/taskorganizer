import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  tags: [String],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = new mongoose.model("Task", taskSchema);

export { Task };
