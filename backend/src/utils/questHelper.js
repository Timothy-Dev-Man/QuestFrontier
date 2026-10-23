import pool from "../../DB/config/db.js"

export function expToNextLevel(level) {
  return Number(level) * 100;
}

export function levelFromExp(exp) {
  return Math.floor(
    (Math.sqrt(1 + (8 * Number(exp)) / 100) - 1) / 2
  ) + 1;
}

export function expRequiredForLevel(level) {
  return ((Number(level) - 1) * Number(level) / 2) * 100
}

export async function createDeadline(questTime, questType) {
  try {
    if (!questTime || !questType) {
      throw new Error("No questTime or no questType", questTime, questType);
    }

    if (!["Daily", "Weekly", "One-time"].includes(questType)) {
      throw new Error("QuestType is not what i expected!", questType);
    }

    const sql = `SELECT now() + interval '1 minute' AS deadline;`
    const results = await pool.query(sql)
    return results.rows[0].deadline
  } catch (err) {
    throw err
  }
}

export async function desideSchedule(type, client) {
  try {
    if (typeof type != string) throw new Error("Type is not a string: ", type);

    // const sql = `SELECT now() + interval '1 minute' AS deadline;`
    // const results = await client.query(sql)
    // return results.rows[0].deadline
  } catch (err) {
    throw err
  }
}


//User / EXP Functions
export function computeExp(time, difficulty) {

  if (!time || !difficulty) {
    throw new Error("Missing param");
  }
  let createdDeadline = new Date(time);
  const difficultySettings = {
    Easy: {
      timeReduction: 0,
      xp: 50,
      coins: 15
    },
    Medium: {
      timeReduction: 15,
      xp: 100,
      coins: 25,
    },
    Hard: {
      timeReduction: 30,
      xp: 175,
      coins: 35,
    },
    Extreme: {
      timeReduction: 45,
      xp: 300,
      coins: 50
    }
  };

  let reward = { exp: 0, coins: 0 }

  const settings = difficultySettings[difficulty]

  if (!settings) {
    throw new Error(`Diff doesn't match: ${difficulty}`)
  }

  reward.exp += settings.xp
  reward.coins += settings.coins

  createdDeadline.setMinutes(
    createdDeadline.getMinutes() - settings.timeReduction
  )

  return { createdDeadline, reward }
}