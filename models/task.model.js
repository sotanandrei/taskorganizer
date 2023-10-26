import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  tags: [String],
  completed: {
    type: Boolean,
    default: false,
  },
  ongoing: {
    type: Boolean,
    default: false,
  },
  pending: {
    type: Boolean,
    default: false,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = new mongoose.model("Task", taskSchema);

export { Task };
