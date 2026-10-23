import {
  changeHunterName,
  changeSetup,
  getHunter,
  getUserInventory,
  getUserProgress,
  getUserStats,
  updateUserStats,
  useInventoryItem,
  getActiveEffects,
  changeEmail,
  changePassword,
  checkCurrentPassword
} from "../services/4_user.service.js"
import { getUserBadge } from "../services/5_badges.service.js"
import pool from "../../DB/config/db.js"

export async function updateUsernameController(req, res) {
  try {
    const userId = req.user.id
    const { newName } = req.body
    const hunterName = await changeHunterName(newName, userId)
    console.info("Username updated successfully")
    res.status(200).json(hunterName)
  } catch (err) {
    console.error("Username update failed")
    res.status(500).json({ message: "Failed to update username" })
  }
}

export async function updateUserEmailController(req, res, next) {
  try {
    const userId = req.user.id
    const { email } = req.body
    const result = await changeEmail(email, userId)

    console.info("Email update completed")
    return res.status(200).json(result)
  } catch (err) {
    console.error("Email update failed")
    next(new Error("Failed to update email"))
  }
}

export async function checkCurrentPasswordController(req, res, next) {
  try {
    const userId = req.user.id
    const { password } = req.body
    const result = await checkCurrentPassword(password, userId)

    console.info("Current password check completed")
    return res.status(200).json(result)
  } catch (err) {
    console.error("Current password check failed")
    next(new Error("Failed to check current password"))
  }
}

export async function updateUserPasswordController(req, res, next) {
  try {
    const userId = req.user.id
    const { password } = req.body
    const result = await changePassword(password, userId)

    console.info("Password update completed")
    return res.status(200).json({
      message: "Password updated successfully",
      user: result,
    })
  } catch (err) {
    console.error("Password update failed")
    next(new Error("Failed to update password"))
  }
}

export async function updateSetupController(req, res) {
  try {
    const userId = req.user.id
    const setup = await changeSetup(userId)
    console.info("User setup updated successfully")
    res.status(200).json(setup)
  } catch (err) {
    console.error("User setup update failed")
    res.status(500).json({ message: "Failed to update user setup" })
  }
}

export async function getUserProfileController(req, res) {
  try {
    const userId = req.user.id
    const hunter = await getHunter(userId)
    const { stats, streak, weekly } = await getUserStats(userId)
    const progress = await getUserProgress(userId)
    const setup = await pool.query("SELECT setup_complete FROM users WHERE id = $1", [userId])
    const data = setup.rows[0]

    console.info("User profile retrieved successfully")
    res.status(200).json({ hunter, stats, streak, weekly, progress, setup: data.setup_complete })
  } catch (err) {
    console.error("User profile retrieval failed")
    res.status(500).json({ message: "Failed to retrieve user profile" })
  }
}

export async function updateUserStatsController(req, res) {
  try {
    const userId = req.user.id
    const { stats } = req.body
    const newStats = await updateUserStats(userId, stats)
    console.info("User stats updated successfully")
    res.status(200).json(newStats)
  } catch (err) {
    console.error("User stats update failed")
    res.status(500).json({ message: "Failed to update user stats" })
  }
}

export async function getUserInventoryController(req, res) {
  try {
    const userId = req.user.id
    const inventory = await getUserInventory(userId)
    console.info("User inventory retrieved successfully")
    res.status(200).json(inventory)
  } catch (err) {
    console.error("User inventory retrieval failed")
    res.status(500).json({ message: "Failed to retrieve user inventory" })
  }
}

export async function useInventoryItemController(req, res) {
  try {
    const userId = req.user.id
    const { itemId } = req.body

    if (!itemId) {
      console.warn("Inventory item use rejected: item ID missing")
      return res.status(400).json({ message: "itemId is required" })
    }

    const result = await useInventoryItem(userId, itemId)
    console.info("Inventory item used successfully")
    res.status(200).json(result)
  } catch (err) {
    console.error("Inventory item use failed")
    res.status(500).json({ message: "Failed to use inventory item" })
  }
}

export async function getActiveEffectsController(req, res) {
  try {
    const userId = req.user.id

    const activeEffects = await getActiveEffects(userId)
    console.info("Active effects retrieved successfully")
    res.status(200).json(activeEffects)
  } catch (err) {
    console.error("Active effects retrieval failed")
    res.status(500).json({ message: "Failed to retrieve active effects" })
  }
}