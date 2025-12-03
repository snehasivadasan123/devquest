import mongoose from 'mongoose';
const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  solution: {
    type: String
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
});

ProgressSchema.index({ userId: 1, questId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
