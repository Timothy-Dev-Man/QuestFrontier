// auth.routes.js
import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getAllPenaltiesController, setListOfApps, getListOfApps, getPenaltyForQuestController } from "../controllers/3_penalty.controller.js"

const router = express.Router()

// POST list of apps
router.post("/list", authenticate, setListOfApps)

// GET list of apps
router.get("/list", authenticate, getListOfApps)

router.get("/active", authenticate, getAllPenaltiesController)

// GET /penalties/active
router.get("/quest/:questId", authenticate, getPenaltyForQuestController)

export default router
