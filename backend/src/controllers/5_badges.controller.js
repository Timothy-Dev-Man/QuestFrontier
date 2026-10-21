import { getBadges, updateBadge } from "../services/5_badges.service.js"

export async function updateUserBadges(req, res) {
  try {
    const userId = req.user.id
    const {badgeId} = req.body
    const badge = await updateBadge(badgeId, userId)
    console.info("User badge updated successfully")
    res.status(200).json(badge)
  } catch (err) {
    console.error("User badge update failed")
    res.status(500).json({ error: "Failed to update user badge" })
  }
}


export async function getBagesFromStore(req, res) {
  try {
    const badges = await getBadges()
    console.info("Badge store retrieved successfully")
    res.status(200).json(badges)
  } catch (err) {
    console.error("Badge store retrieval failed")
    res.status(500).json({ error: "Failed to retrieve badge store" })
  }
}