// user.routes.js
import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validation.middleware.js"
import { hunterNameValidation } from "../validations/hunterNameValidation.js"
import {
  updateUsernameController,
  getUserProfileController,
  updateUserStatsController,
  getUserInventoryController,
  useInventoryItemController,
  updateSetupController,
  getActiveEffectsController,
  updateUserEmailController,
  checkCurrentPasswordController,
  updateUserPasswordController,
} from "../controllers/4_user.controller.js"

const router = express.Router()

// GET current user profile
router.get("/profile", authenticate, getUserProfileController)

// PATCH update username
router.put("/setup", authenticate, updateSetupController)

// PATCH update user stats
router.patch("/stats", authenticate, updateUserStatsController)

// GET user inventory
router.get("/inventory", authenticate, getUserInventoryController)

// POST use inventory item
router.post("/inventory/use", authenticate, useInventoryItemController)

// POST use inventory item
router.get("/inventory/effect", authenticate, getActiveEffectsController)

// PATCH update username
router.put("/update/name", authenticate, ...hunterNameValidation, validate, updateUsernameController)

// PATCH update password
router.put("/update/email", authenticate, updateUserEmailController)

// PATCH update password
router.put("/update/password", authenticate, updateUserPasswordController)

// PATCH update password
router.post("/check/password", authenticate, checkCurrentPasswordController)

export default router
//IamTheMan!1