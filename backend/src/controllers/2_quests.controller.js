import {
  getUserQuests,
  getQuestById,
  createQuest,
  updateProgress,
  updateQuestDescription
} from "../services/2_quests.service.js"

export async function getQuestsController(req, res) {
  try {
    const userId = req.user.id;
    const getQuests = await getUserQuests(userId);
    console.info("Quest retrieval succeeded")

    return res.status(200).json(getQuests);

  } catch (err) {
    console.error("Quest retrieval failed");

    return res.status(500).json({
      message: "Failed to retrieve quests"
    });
  }
}

export async function getQuestsByIdController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id
    const getQuestId = await getQuestById(userId, questId)
    console.info("Quest retrieval succeeded")
    res.status(200).json(getQuestId)
  } catch (err) {
    console.error("Quest retrieval failed")
    res.status(400).json({ message: "Failed to retrieve quest" })
  }
}

export async function updateQuestDescriptionController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id
    const { newDescription } = req.body;
    if (!questId) {
      console.warn("Quest description update rejected: quest ID missing")
      return res.status(400).json({ message: "No questId provided" });
    }

    const updateDescription = await updateQuestDescription(userId, questId, newDescription)

    console.info("Quest description updated successfully")
    res.status(201).json(updateDescription)
  } catch (err) {
    console.error("Quest description update failed")
    res.status(500).json({
      message: "Failed to update quest description",
    });

  }
}

export async function createQuestController(req, res) {
  try {
    const userId = req.user.id
    const { questData } = req.body;
    if (!questData) {
      console.warn("Quest creation rejected: quest data missing")
      return res.status(400).json({ message: "No quest data provided" });
    }
    const { questTitle, time, deadline, type, questDescription, difficulty } = questData;

    const newQuest = await createQuest(userId, { questTitle, time, type, deadline, questDescription, difficulty })

    console.info("Quest created successfully")
    res.status(201).json(newQuest)
  } catch (err) {
    console.error("Quest creation failed")
    res.status(500).json({
      message: "Failed to create quest",
    });

  }
}

export async function updateProgressController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id

    const newProgress = await updateProgress(userId, questId)

    if (!newProgress) {
      console.warn("Quest completion rejected")
      return res.status(400).json({
        success: false,
        message: "Quest could not be completed."
      });
    }
    res.status(200).json(newProgress)
  } catch (err) {
    console.error("Quest completion failed")
    res.status(500).json({ message: "Failed to complete quest" })
  }
}