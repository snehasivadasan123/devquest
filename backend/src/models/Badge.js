import { Schema, model } from 'mongoose';

const BadgeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Badge description is required']
  },
  icon: {
    type: String,
    default: '🏆'
  },
  criteria: {
    type: {
      type: String,
      enum: ['quest_count', 'points', 'difficulty', 'category', 'streak'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    category: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Badge', BadgeSchema);
