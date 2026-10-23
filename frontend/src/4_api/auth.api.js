async function parseAuthResponse(response) {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      typeof data?.message === "string" && data.message.trim()
        ? data.message
        : typeof data?.errors?.[0]?.message === "string" && data.errors[0].message.trim()
          ? data.errors[0].message
          : `Request failed (${response.status})`;
    const error = new Error(message)
    error.response = { status: response.status, data }
    throw error
  }

  return data
}

export async function fetchLogin(credentials) {
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
  return parseAuthResponse(response)
}

//Admin
//rizz@gmail.com
//Password1!

export async function fetchRegister(credentials) {
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
  return parseAuthResponse(response)
}

export async function fetchLogout(token) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
  return parseAuthResponse(response)
}

export async function fetchCheckUserExists(email) {
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
  return parseAuthResponse(response)
}

export async function fetchForgotPassword(email) {
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
  return parseAuthResponse(response)
}

export async function fetchVerifyReset(email, code) {
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
  return parseAuthResponse(response)
}

export async function fetchResetPassword(password, userId) {
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
  return parseAuthResponse(response)
}