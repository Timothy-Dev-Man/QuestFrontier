// auth.controller.js
import { registerUser, loginUser } from "../services/1_auth.service.js"

export async function register(req, res) {
  // extract data from req.body, call auth.service.registerUser, send JSON response
  try {
    const { name, email, password } = req.body
    const user = await registerUser(name, email, password)
    res.status(200).json(user)
  } catch (err) {
    console.error("User registration failed")
    res.status(500).json("User registration failed")
  }
}

export async function login(req, res) {
  // extract credentials from req.body, call auth.service.loginUser, send JSON response
  try {
    const { email, password } = req.body
    const user = await loginUser(email, password)
    console.info("User login succeeded")
    res.status(200).json(user)
  } catch (err) {
    console.warn("User login failed")
    res.status(401).json({ error: "Invalid email or password" })
  }
}

export function me(req, res) {
  // optional: return current user info (expects middleware to have set req.userId)
}
