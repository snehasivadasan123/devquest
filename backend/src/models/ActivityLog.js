import { Schema, model } from 'mongoose';

const ActivityLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  actionType: {
    type: String,
    enum: [
      'quest_created',
      'quest_completed',
      'badge_earned',
      'level_up',
      'solution_submitted',
      'solution_upvoted'
    ],
    required: true
  },
  metadata: {
    questId: {
      type: Schema.Types.ObjectId,
      ref: 'Quest'
    },
    badgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Badge'
    },
    solutionId: {
      type: Schema.Types.ObjectId,
      ref: 'Solution'
    },
    pointsEarned: {
      type: Number
    },
    newLevel: {
      type: Number
    },
    questTitle: {
      type: String
    },
    badgeName: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export default model('ActivityLog', ActivityLogSchema);
