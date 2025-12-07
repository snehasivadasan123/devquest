import Quest from "../models/Quest.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";

export async function getAllQuests(req, res) {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const totalQuests = await Quest.countDocuments();
    
    // Get paginated quests
    const quests = await Quest.find()
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      quests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalQuests / limit),
        totalQuests,
        questsPerPage: limit,
        hasNextPage: page < Math.ceil(totalQuests / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching quests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



export async function createQuest(req, res) {
  console.log("reached")
  try {
    const { title, description, points, difficulty } = req.body;

    if (!title || !description || !points || !difficulty ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuest = new Quest({
      title,
      description,
      points,
      difficulty,
    
    });
    
    const savedQuest = await newQuest.save();
    
    res.status(201).json({ 
      message: "Quest created successfully", 
      quest: savedQuest 
    });

  } catch (error) {
    console.error("Error creating quest:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

export async function getQuestById(req, res) {
  try {
    const questId = req.params.id;
    const quest = await Quest.findById(questId);
    if (!quest) {
      return res.status(404).json({ error: "Quest not found" });
    }
    res.status(200).json(quest);
  } catch (error) {
    console.error("Error fetching quest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateQuest(req, res) {
  try {
    const questId = req.params.id;
    const updates = req.body;
    const updatedQuest = await Quest.findByIdAndUpdate(questId, updates, { new: true });
    if (!updatedQuest) {
      return res.status(404).json({ error: "Quest not found" });
    }

    res.status(200).json(updatedQuest);
  } catch (error) {
    console.error("Error updating quest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function deleteQuest(req, res) {
  try {
    const questId = req.params.id;

    const deletedQuest = await Quest.findByIdAndDelete(questId);
    if (!deletedQuest) {
      return res.status(404).json({ error: "Quest not found" });
    }

    // Find all progress records for this quest
    const progressRecords = await Progress.find({ questId, completed: true });

    // Update each user who completed this quest
    for (const progress of progressRecords) {
      // Remove quest from completedQuests and subtract XP
      await User.findByIdAndUpdate(progress.userId, {
        $pull: { completedQuests: questId },
        $inc: { points: -(progress.pointsEarned || 0) }
      });

      // Recalculate level
      const updatedUser = await User.findById(progress.userId);
      const newLevel = Math.floor(updatedUser.points / 1000) + 1;
      
      if (newLevel !== updatedUser.level) {
        await User.findByIdAndUpdate(progress.userId, { level: newLevel });
      }
    }

    // Delete all progress records for this quest
    await Progress.deleteMany({ questId });

    res.status(200).json({ 
      message: "Quest deleted successfully",
      affectedUsers: progressRecords.length
    });
  } catch (error) {
    console.error("Error deleting quest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
