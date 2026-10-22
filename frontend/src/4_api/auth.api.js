export async function fetchLogin(credentials) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: credentials.value,
          password: credentials.password,
        }),
      },
    )
    if (!response.ok) {
      throw new Error(
        "Network response was not ok and status: " + response.status,
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error("Fetching data:" + error)
  }
}

export async function fetchRegister(credentials) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        }),
      },
    )
    const data = await response.json()
    if (!response.ok) {
      throw new Error("Network response was NOT ok. Status: " + response.status)
    }
    return data
  } catch (err) {
    throw err
  }
}

export async function fetchLogout(token) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    const data = await response.json()
    if (!response.ok) {
      throw new Error("Network response was NOT ok. Status: " + response.status)
    }
    return data
  } catch (err) {
    throw err
  }
}

export async function fetchCheckUserExists(email) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/checkUser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    )
    const data = await response.json()
    if (!response.ok) {
      throw new Error("Network response was NOT ok. Status: " + response.status)
    }
    return data
  } catch (err) {
    throw err
  }
}

export async function fetchForgotPassword(email) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    )
    const data = await response.json()
    if (!response.ok) {
      throw new Error("Network response was NOT ok. Status: " + response.status)
    }
    return data
  } catch (err) {
    throw err
  }
}

export async function fetchVerifyReset(email, code) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/verify-reset-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      },
    )
    const data = await response.json()
    if (!response.ok) {
      throw new Error("Network response was NOT ok. Status: " + response.status)
    }
    return data
  } catch (err) {
    throw err
  }
}

export async function fetchResetPassword(password, userId) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, userId }),
      },
    )
    const data = await response.json()
    if (!response.ok) {
      throw new Error("Network response was NOT ok. Status: " + response.status)
    }
    return data
  } catch (err) {
    throw err
  }
}