import { Schema, model } from "mongoose";

const SolutionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questId: {
    type: Schema.Types.ObjectId,
    ref: "Quest",
    required: true,
  },
  solutionText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default model("Solution", SolutionSchema);
