import Quest from "../models/Quest.js";

export async function getAllQuests(req, res) {
  try {
    const quests = await Quest.find();
    res.status(200).json(quests);
  } catch (error) {
    console.error("Error fetching quests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function createQuest(req, res) {
  try {
    const userId = req.user.userId
    const { title, description, points, difficulty } = req.body;

    const newQuest = new Quest({
      title,
      description,
      points,
      difficulty,
      createdBy: userId
    });
    const savedQuest = await newQuest.save();
    await ActivityLog.create({
      userId,
      actionType: 'quest_created',
      metadata: {
        questId: Quest._id,
        questTitle: Quest.title
      }
    });
    res.status(201).json("quest has created successfully", savedQuest);

  }
  catch (error) {
    console.error("Error creating quest:", error);
    res.status(500).json({ error: "Internal server error" });
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
    const userId = req.user.userId;
    const questId = req.params.id;
    const updates = req.body;
    const updatedQuest = await Quest.findById(questId, updates, { new: true });
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
    const userId = req.user.userId;

    const deletedQuest = await Quest.findByIdAndDelete(questId);
    if (!deletedQuest) {
      return res.status(404).json({ error: "Quest not found" });
    }
    res.status(200).json({ message: "Quest deleted successfully" });
  } catch (error) {
    console.error("Error deleting quest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
