//Quest Service Functions
import pool from "../../DB/config/db.js"
import cron from "node-cron"

import { myEmitter, boss } from "./eventEmitter.js";

import { computeExp, createDeadline, expToNextLevel } from "../utils/questHelper.js"

async function getActiveMultiplier(client, userId, effectType) {
  const sql = `
    SELECT COALESCE(MAX(e.value), 1) AS multiplier
    FROM user_effects ue
    JOIN effects e ON e.id = ue.effect_id
    WHERE ue.user_id = $1
      AND ue.active = true
      AND (e.effect_type = $2 OR e.effect_type = 'xp_coin_multiplier')
      AND (ue.expires_at IS NULL OR ue.expires_at > now());
  `
  const result = await client.query(sql, [userId, effectType])
  return Number(result.rows[0]?.multiplier ?? 1)
}

export async function getUserQuests(userId) {
  try {
    const sql = `
  SELECT *
  FROM quests
  WHERE user_id = $1
  ORDER BY
    CASE
      WHEN status = 'pending' THEN 1
      WHEN status = 'completed' THEN 2
      WHEN status = 'failed' THEN 3
      ELSE 4
    END,
    id DESC;
`;
    const results = await pool.query(sql, [userId])
    return results.rows
  } catch (err) {
    throw new Error(err)
  }
}

export async function updateQuestDescription(userId, questId, newDescription) {
  try {
    if (newDescription === null) {
      newDescription = ''
    }
    const sql = `
  UPDATE quests
  SET description = $1
  WHERE id = $2 AND user_id = $3
  RETURNING *;
`;
    const results = await pool.query(sql, [newDescription, questId, userId])
    return results.rows[0]
  } catch (err) {
    throw new Error(err)
  }
}

export async function getQuestById(userId, questId) {
  try {
    const sql = `SELECT * FROM quests WHERE user_id = $1 AND id = $2`
    const results = await pool.query(sql, [userId, questId])
    return results.rows[0]
  } catch (err) {
    throw new Error(err)
  }
}

export async function updateProgress(userId, questId) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const sql = `
  UPDATE quests 
  SET 
    is_completed = TRUE, 
    status = 'completed',
    completed_at = NOW() 
  WHERE 
    user_id = $1 
    AND id = $2 
    AND is_completed = FALSE 
    AND status = 'pending'
  RETURNING *;`;


    //    AND start <= now()
    //    AND deadline >= now() 
    const results = await client.query(sql, [userId, questId])
    const quest = results.rows[0];

    if (!quest) {
      await client.query("ROLLBACK")
      return;
    }

    await client.query(`UPDATE user_stats SET completed_quests = completed_quests + 1 WHERE user_id = $1 RETURNING completed_quests;`, [userId])

    await client.query(
      `UPDATE streaks
       SET
         current_streak = CASE
           WHEN last_completed_at::date = CURRENT_DATE
             THEN current_streak
           WHEN last_completed_at::date = CURRENT_DATE - 1
             THEN current_streak + 1
           ELSE 1
         END,
    
         longest_streak = GREATEST(
           longest_streak,
           CASE
             WHEN last_completed_at::date = CURRENT_DATE
               THEN current_streak
             WHEN last_completed_at::date = CURRENT_DATE - 1
               THEN current_streak + 1
             ELSE 1
           END
         ),
    
         last_completed_at = NOW()
    
       WHERE user_id = $1
    
       RETURNING current_streak, longest_streak, last_completed_at;`,
      [userId]
    )

    await client.query("COMMIT")

    await boss.send(
      "quest-completed",
      {
        questId: quest.id,
        userId: quest.user_id
      }
    );

    console.info("Quest completion processed successfully")

    return quest;
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    await client.release()
  }
}

export async function recurringQuest(userId, quest) {
  try {
    let cronTime = "";

    if (quest.type === "One-time") {
      return;
    }

    const startDate = new Date(quest.start);

    if (Number.isNaN(startDate.getTime())) {
      throw new Error("Invalid quest start date");
    }

    const easternParts = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .formatToParts(startDate)
        .filter(({ type }) => type !== "literal")
        .map(({ type, value }) => [type, value])
    );

    const weekdays = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    if (quest.type === "Daily") {
      cronTime = `${Number(easternParts.minute)} ${Number(easternParts.hour)} * * *`;
    } else if (quest.type === "Weekly") {
      cronTime = `${Number(easternParts.minute)} ${Number(easternParts.hour)} * * ${weekdays[easternParts.weekday]}`;
    } else {
      throw new Error("Invalid recurring quest type");
    }

    await boss.schedule(
      "recurring-quest",
      cronTime, // Optional: Include it here if you need it logged/tracked in job.data
      {
        userId,
        questId: quest.id,
        title: quest.title,
        description: quest.description,
        difficulty: quest.difficulty,
        type: quest.type,
        start: quest.start,
        deadline: quest.deadline
      },
      {
        key: String(quest.id),
        tz: "America/New_York"
      }
    );
    console.info("Recurring quest scheduled successfully")

  } catch (err) {
    throw err;
  }
}

export async function createQuest(
  userId,
  {
    questTitle,
    time,
    deadline,
    type,
    questDescription,
    difficulty,
    recurringParentId = null,
  },
  shouldSchedule = true,
  deadlineAlreadyAdjusted = false
) {
  // insert a new quest in the DB and return the created quest
  try {

    let questStart = new Date(time);
    let questDeadlineInput = new Date(deadline);

    // If the start time has passed, move the quest to tomorrow.
    // If the start time has passed, move both dates to tomorrow.
    if (questStart < new Date()) {
      questStart.setDate(questStart.getDate() + 1);
      questDeadlineInput.setDate(questDeadlineInput.getDate() + 1);
    }

    // If the deadline is still before the start, move the deadline forward.
    while (questDeadlineInput < questStart) {
      questDeadlineInput.setDate(questDeadlineInput.getDate() + 1);
    }

    const { createdDeadline, reward } = computeExp(
      questDeadlineInput,
      difficulty
    );

    const questDeadline = deadlineAlreadyAdjusted
      ? questDeadlineInput
      : createdDeadline;

    const sql = `
    INSERT INTO quests (
    user_id, title, type, start, deadline, 
    description, difficulty, reward, recurring_parent_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (recurring_parent_id, start)
    WHERE recurring_parent_id IS NOT NULL
    DO NOTHING
    RETURNING *;`

    const results = await pool.query(sql, [
      userId,
      questTitle,
      type,
      questStart,
      questDeadline,
      questDescription,
      difficulty,
      reward,
      recurringParentId
    ])

    let quest = results.rows[0];

    if (!quest && recurringParentId !== null) {
      const existing = await pool.query(
        `SELECT * FROM quests
     WHERE recurring_parent_id = $1 AND start = $2`,
        [recurringParentId, questStart]
      );

      quest = existing.rows[0];
    }

    if (!quest) {
      throw new Error("Failed to create or find quest instance");
    }

    if (shouldSchedule) {
      await recurringQuest(userId, quest)
    }

    await boss.send(
      "quest-deadline",
      { questId: quest.id },
      {
        startAfter: quest.deadline,
        singletonKey: `quest-deadline-${quest.id}`,
      }
    );

    return quest
  } catch (err) {
    throw err
  }
}
