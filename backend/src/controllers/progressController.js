import Progress from '../models/Progress.js'
import mongoose from 'mongoose';
import User from '../models/User.js';
import Quest from '../models/Quest.js';
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.query;  
    console.log("Fetching progress for userId:", userId);
    // const objectId = new mongoose.Types.ObjectId(userId);

    const progressRecords = await Progress.find({ userId });
     if (!progressRecords.length) {
      return res.status(200).json({ message: "No progress found", data: [] });
    }

    res.status(200).json(progressRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }         
};



export const createOrUpdateProgress = async (req, res) => {
  try {
    const { userId, questId, completed, pointsEarned } = req.body;

    // Validate required fields
    if (!userId || !questId) {
      return res.status(400).json({ error: 'userId and questId are required' });
    }

    // Find existing progress
    let progressRecord = await Progress.findOne({ userId, questId });
    
    if (progressRecord) {
      // Store old values to calculate XP difference
      const wasCompleted = progressRecord.completed;
      const oldPoints = progressRecord.pointsEarned;
      
      // Update existing progress
      progressRecord.completed = completed !== undefined ? completed : progressRecord.completed;
      progressRecord.pointsEarned = pointsEarned !== undefined ? pointsEarned : progressRecord.pointsEarned;
      
      if (completed && !progressRecord.completedAt) {
        progressRecord.completedAt = new Date();
      } else if (!completed) {
        progressRecord.completedAt = null; // Clear completion date
      }

      await progressRecord.save();
      
      // Update user based on status change
      if (completed && !wasCompleted) {
        // Marking as complete
        await User.findByIdAndUpdate(userId, {
          $addToSet: { completedQuests: questId },
          $inc: { points: pointsEarned || 0 }
        });
        
        // Check for level up
        const updatedUser = await User.findById(userId);
        const newLevel = Math.floor(updatedUser.points / 1000) + 1;
        
        if (newLevel > updatedUser.level) {
          await User.findByIdAndUpdate(userId, { level: newLevel });
          console.log(`User ${userId} leveled up to ${newLevel}!`);
        }
        
      } else if (!completed && wasCompleted) {
        // Marking as pending (uncomplete)
        await User.findByIdAndUpdate(userId, {
          $pull: { completedQuests: questId },
          $inc: { points: -(oldPoints || 0) }
        });
        
        // Check for level down
        const updatedUser = await User.findById(userId);
        const newLevel = Math.floor(updatedUser.points / 1000) + 1;
        
        if (newLevel < updatedUser.level) {
          await User.findByIdAndUpdate(userId, { level: newLevel });
          console.log(`User ${userId} leveled down to ${newLevel}`);
        }
      }
      
      res.status(200).json(progressRecord);
      
    } else {
      // Create new progress
      progressRecord = new Progress({
        userId,
        questId,
        completed: completed || false,
        pointsEarned: pointsEarned || 0
      });
      
      if (completed) {
        progressRecord.completedAt = new Date();
      }

      await progressRecord.save();
      
      // If marking as complete, update user
      if (completed) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { completedQuests: questId },
          $inc: { points: pointsEarned || 0 }
        });
        
        // Check for level up
        const updatedUser = await User.findById(userId);
        const newLevel = Math.floor(updatedUser.points / 1000) + 1;
        
        if (newLevel > updatedUser.level) {
          await User.findByIdAndUpdate(userId, { level: newLevel });
          console.log(`User ${userId} leveled up to ${newLevel}!`);
        }
      }
      
      res.status(201).json(progressRecord);
    }
    
  } catch (error) {
    console.error('Error in createOrUpdateProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserProgressPercentage = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalQuests = await Quest.countDocuments();
    const completedQuests = await Progress.countDocuments({ userId, completed: true });

    const percentage = totalQuests === 0 
      ? 0 
      : ((completedQuests / totalQuests) * 100).toFixed(2);

    res.status(200).json({
      userId,
      totalQuests,
      completedQuests,
      percentage,
    });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};