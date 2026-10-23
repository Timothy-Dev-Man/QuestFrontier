import { parseErrorResponse } from "./auth.api"

export async function fetchUpdateHunterName(name, token) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/name`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newName: name }),
    },
  )

  return parseErrorResponse(response)
}

export async function fetchUserProfile(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/profile`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[user.api] Failed to fetch user profile", err)
    throw err
  }
}

export async function fetchUserInventory(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/inventory`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[user.api] Failed to fetch inventory", err)
    throw err
  }
}

export async function fetchUserShop(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/shop/`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[user.api] Failed to fetch shop", err)
    throw err
  }
}

export async function fetchUserSetup(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/setup`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })
    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[user.api] Failed to fetch setup", err)
    throw err
  }
}

export async function updateUsername(token, username) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/update/name`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newName: username }),
    })

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[user.api] Failed to update username", err)
    throw err
  }
}

export async function updateUserEmail(token, email) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/update/email`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    })

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[user.api] Failed to update email", err)
    throw err
  }
}

export async function updateUserPassword(token, password) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/update/password`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    })

    return await parseErrorResponse(response)
  } catch (err) {
    console.error("[user.api] Failed to update password", err)
    throw err
  }
}