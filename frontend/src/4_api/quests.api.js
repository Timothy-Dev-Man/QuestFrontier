import { parseErrorResponse } from "./auth.api"

export async function fetchQuests(token) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return parseErrorResponse(response)
}

export async function fetchQuestById(token, questId) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests/${questId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return parseErrorResponse(response)
}

export async function fetchCreateQuests(token, credentials) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questData: {
            questTitle: credentials.questTitle.trim(),
            time: credentials.questTime,
            deadline: credentials.deadline,
            type: credentials.type,
            questDescription: credentials.questDescription.trim(),
            difficulty: credentials.difficulty.name,
          },
        }),
      },
    )

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[quests.api] Failed to create quest", err)
    throw err
  }
}

export async function fetchUpdateProgress(token, questId) {

  try {

    const url =
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests/${questId}/update`
    const response = await fetch(
      url,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return await parseErrorResponse(response)

  } catch (err) {

    console.error(
      "[quests.api] Failed to update quest progress",
      err
    )

    throw err
  }
}

export async function fetchUpdateDescription(token, questId, newDescription) {
  try {

    const url =
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests/${questId}/updateDescription`
    const response = await fetch(
      url,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newDescription: newDescription
        })
      },
    )

    return await parseErrorResponse(response)

  } catch (err) {

    console.error(
      "[quests.api] Failed to update quest description",
      err
    )

    throw err
  }
}

export async function fetchPenaltyForQuest(token) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/penalties/active`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      },
    )

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[quests.api] Failed to fetch active penalty", err)
    throw err
  }
}

