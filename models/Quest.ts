import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuest extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const QuestSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    default: 'easy'
  },
  points: {
    type: Number,
    required: true,
    min: [10, 'Points must be at least 10']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Quest: Model<IQuest> = mongoose.models.Quest || mongoose.model<IQuest>('Quest', QuestSchema);

export default Quest;
