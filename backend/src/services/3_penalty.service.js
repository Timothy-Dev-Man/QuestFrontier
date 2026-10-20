import pool from "../../DB/config/db.js";


// Gets active penalty for the overlay
export async function getAllActivePenalties(userId) {
  try {
    const sql = `SELECT active, ends_at FROM penalties WHERE user_id = $1 AND active = true AND (ends_at IS NULL OR ends_at > now())
    ORDER BY ends_at DESC LIMIT 1;`
    const results = await pool.query(sql, [userId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}

// Gets active penalty for the overlay
export async function getPenaltyByQuest(questId, userId) {
  try {
    const sql = `
      SELECT id, user_id, quest_id, active, restricted_apps, started_at, ends_at
      FROM penalties
      WHERE user_id = $1 AND quest_id = $2 AND active = true;`

    const results = await pool.query(sql, [userId, questId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}

// Adds the list to restricted_apps in penalties.sql
export async function addListToRestricted(userId, ListOfApps) {
  try {
    const sql = `
      INSERT INTO blocked_apps (user_id, app_list)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET app_list = EXCLUDED.app_list
      RETURNING app_list;
    `;

    const results = await pool.query(sql, [userId, ListOfApps]);
    return results.rows[0];
  } catch (err) {
    throw err;
  }
}

export async function getRestrictedApps(userId) {
  try {
    const sql = `
      SELECT app_list
      FROM blocked_apps
      WHERE user_id = $1;
    `;

    const results = await pool.query(sql, [userId]);
    return results.rows[0]?.app_list ?? [];
  } catch (err) {
    throw err;
  }
}