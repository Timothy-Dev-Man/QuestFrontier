// REQUIRED FOR OVERLAY: Syncs penalty state and restricted apps to the native side.
// AppWatcherService (native) is the single owner of showing/hiding the overlay;
// this file only feeds it state and handles the overlay permission.
import { NativeModules, Platform, AppState } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getActivePenalty } from "./penaltyUtils"
import { STORAGE_KEYS } from "./storage"

const { AppWatcherServiceModule, OverlayModule } = NativeModules

export let blockedApps = [] // package names
let appStateSubscription = null

const parseEndsAtMillis = (penalty) => {
  const raw = penalty?.ends_at || penalty?.endsAt || penalty?.endsAtIso
  if (!raw) return 0
  const millis = Date.parse(raw)
  return Number.isNaN(millis) ? 0 : millis
}

// Push the current penalty to native. On a failed fetch, keep the last known
// state instead of clearing it, so a network blip doesn't unblock apps.
const syncPenaltyState = async () => {
  if (!AppWatcherServiceModule) return

  const penalty = await getActivePenalty()
  if (penalty === null) return

  // When no penalty is active the backend returns a plain string
  const penaltyActive = penalty?.active === true
  AppWatcherServiceModule.setPenaltyEndsAtMillis?.(
    penaltyActive ? parseEndsAtMillis(penalty) : 0,
  )
  AppWatcherServiceModule.setPenaltyActive?.(penaltyActive)
}

export const getBlockedApps = () => blockedApps

// Replace the restricted app list (package names) and push it to native
const applyBlockedApps = (packages) => {
  blockedApps = [
    ...new Set(
      (packages || []).filter((pkg) => typeof pkg === "string" && pkg.length > 0),
    ),
  ]
  AppWatcherServiceModule?.setRestrictedApps?.(blockedApps)
  console.info(`[OVERLAY] Restricted apps synced (${blockedApps.length})`)
}

export const clearAccountOverlayState = async () => {
  applyBlockedApps([])
  AppWatcherServiceModule?.setPenaltyEndsAtMillis?.(0)
  AppWatcherServiceModule?.setPenaltyActive?.(false)

  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.BLOCKED_APPS)
  } catch (error) {
    console.warn("[OVERLAY] Failed to clear cached blocked apps:", error)
  }
}

// Save the user's chosen apps so they survive app restarts
export const setBlockedApps = async (packages) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/penalties/list`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        list: packages,
      }),
    },
  )
  if (!response.ok) {
    throw new Error(`[OVERLAY] Failed to save blocked apps (${response.status})`)
  }

  return loadSavedBlockedApps()
}

export const loadSavedBlockedApps = async () => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/penalties/list`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`)
    }

    const data = await response.json()
    const packages = Array.isArray(data)
      ? data
      : data?.list || data?.restricted_apps || data?.restrictedApps
    if (!Array.isArray(packages)) {
      throw new Error("Unexpected blocked-app response")
    }

    applyBlockedApps(packages)
    await AsyncStorage.setItem(STORAGE_KEYS.BLOCKED_APPS, JSON.stringify(blockedApps))
    return blockedApps
  } catch (error) {
    console.warn("[OVERLAY] Failed to fetch blocked apps; using saved list:", error)
  }

  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.BLOCKED_APPS)
    const parsed = saved ? JSON.parse(saved) : []
    const packages = Array.isArray(parsed) ? parsed : []
    applyBlockedApps(packages)
    return blockedApps
  } catch (error) {
    console.warn("[OVERLAY] Failed to load blocked apps:", error)
    applyBlockedApps([])
    return []
  }
}

// Check if overlay permission is granted
export const checkOverlayPermission = async () => {
  if (!OverlayModule) {
    console.warn("[OVERLAY] Native overlay module unavailable")
    return false
  }

  try {
    return await OverlayModule.checkOverlayPermission()
  } catch (error) {
    console.error("[OVERLAY] Failed to check overlay permission", error)
    return false
  }
}

// Request overlay permission
export const requestOverlayPermission = () => {
  if (!OverlayModule) {
    console.warn("[OVERLAY] Native overlay module unavailable")
    return
  }

  try {
    OverlayModule.requestOverlayPermission()
  } catch (error) {
    console.error("[OVERLAY] Failed to request overlay permission", error)
  }
}

// Start the AppWatcher service and sync state to it. Safe to call repeatedly.
export const startAppWatcherService = async () => {
  if (Platform.OS !== "android") return

  if (!AppWatcherServiceModule) {
    console.warn("[OVERLAY] App watcher module unavailable")
    return
  }

  AppWatcherServiceModule.startService()

  if (!(await checkOverlayPermission())) {
    console.warn("[OVERLAY] Permission missing; opening system settings")
    requestOverlayPermission()
  }

  await loadSavedBlockedApps()

  await syncPenaltyState()

  // Register once; re-sync whenever the app returns to the foreground
  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        syncPenaltyState()
      }
    })
  }
}
