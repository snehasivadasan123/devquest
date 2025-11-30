import mongoose, { Schema, Document, Model } from "mongoose"

export interface Iuser extends Document {
    username: string,
    email: string,
    password: string,
    createdAt: Date,
    points: number,
    level: number,
    badges: string[],
    completedQuests: mongoose.Types.ObjectId[]

}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username cannot exceed 20 characters']

    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true, lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
            minlength: [6, 'Password must be at least 6 characters']

    },
    createdAt: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badge:[{
    type:String
  }],
  CompletedQuests:[{
    type:Schema.Types.ObjectId,
    ref:'Quest'
  }]
})
const User: Model<Iuser> = mongoose.models.User || mongoose.model<Iuser>('User', UserSchema);
export default User;
