import { Schema, model } from 'mongoose';

const SolutionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  questId: {
    type: Schema.Types.ObjectId,
    ref: 'Quest',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: [true, 'Solution code is required'],
    minlength: [10, 'Solution must be at least 10 characters']
  },
  language: {
    type: String,
    required: true,
    default: 'javascript'
  },
  explanation: {
    type: String,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

SolutionSchema.index({ questId: 1, upvotes: -1 });
SolutionSchema.index({ userId: 1, questId: 1 });

export default model('Solution', SolutionSchema);
