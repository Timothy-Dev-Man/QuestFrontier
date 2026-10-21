import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: false,
})

// Log unexpected errors
pool.on("error", () => {
  console.error("Unexpected database client error")
})

export default pool
