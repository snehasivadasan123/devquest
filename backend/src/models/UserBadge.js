import { Schema, model } from 'mongoose';

const UserBadgeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  badgeId: {
    type: Schema.Types.ObjectId,
    ref: 'Badge',
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
});

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export default model('UserBadge', UserBadgeSchema);
