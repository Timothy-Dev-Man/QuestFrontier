import { addListToRestricted, getPenaltyByQuest, getAllActivePenalties, getRestrictedApps } from '../services/3_penalty.service.js';

// Get the active penalty
export async function getAllPenaltiesController(req, res) {
  try {
    const userId = req.user.id
    const getPenalty = await getAllActivePenalties(userId)
    console.info("Active penalty retrieval completed")
    if (getPenalty === null || getPenalty === undefined) {
      return res.status(200).json({ message: "There are no penalties active" })
    }
    res.status(200).json(getPenalty)
  } catch (err) {
    console.error("Active penalty retrieval failed")
    res.status(500).json({ err: "Failed to retrieve active penalties" })
  }
}

// Get one active penalty
export async function getPenaltyForQuestController(req, res) {
  try {
    const userId = req.user.id
    const questId = parseInt(req.params.questId, 10)

    const getPenalty = await getPenaltyByQuest(questId, userId)
    console.info("Quest penalty retrieval completed")

    if (!getPenalty) {
      return res.status(200).json({ message: "No active penalty for this quest", active: false });
    }

    res.status(200).json({
      active: true,
      endsAt: getPenalty.ends_at,
      restrictedApps: getPenalty.restrictedApps || []
    })
  } catch (err) {
    console.error("Quest penalty retrieval failed")
    res.status(500).json({ message: "Failed to retrieve quest penalty" })
  }
}

// POST the list of restricted app from front-end
export async function setListOfApps(req, res) {
  try {
    const userId = req.user.id
    const { list } = req.body
    if (list.length < 2) {
      console.warn("Restricted app update rejected: at least two apps are required")

      throw new Error("Choose 2 or more apps to block.");

    }

    const setList = await addListToRestricted(userId, list)
    console.info("Restricted app list updated successfully")
    res.status(200).json(setList)
  } catch (err) {
    console.error("Restricted app list update failed")
    res.status(500).json({ message: "Failed to update restricted app list" })
  }
}

// Get the list of restricted app from front-end
export async function getListOfApps(req, res) {
  try {
    const userId = req.user.id
    const getList = await getRestrictedApps(userId)
    console.info("Restricted app list retrieval succeeded")
    res.status(200).json(getList)
  } catch (err) {
    console.error("Restricted app list retrieval failed")
    res.status(500).json({ message: "Failed to retrieve restricted app list" })
  }
}

