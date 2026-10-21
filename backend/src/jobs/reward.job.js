import pool from "../../DB/config/db.js"
import { sendSseEvent } from "../services/sse.service.js"
import { myEmitter, boss } from "../services/eventEmitter.js";
import { levelFromExp, expRequiredForLevel } from "../utils/questHelper.js"

export async function startRewardWorker() {

    boss.work("quest-completed", async ([job]) => {
        const client = await pool.connect()
        try {

            const { questId, userId } = job.data;

            await client.query("BEGIN")

            // Get the reward
            const getReward = "SELECT reward FROM quests WHERE id = $1 and user_id = $2"
            const reward = await client.query(getReward, [questId, userId])
            if (!reward.rows[0]) {
                console.info("Reward job skipped: no reward available")
                await client.query("ROLLBACK");
                return;
            }

            // Get coins from reward
            const coins = reward.rows[0].reward.coins
            const updateUserCoinsSql = "UPDATE progress SET coins = coins + $1 WHERE user_id = $2;"
            await client.query(updateUserCoinsSql, [coins, userId])

            // Get user stats
            const statReward = 'INSERT INTO quest_rewards (quest_id, user_id, amount, granted_at) VALUES ($1, $2, $3, now()) ON CONFLICT (quest_id) DO NOTHING RETURNING *'
            const statResults = await client.query(statReward, [questId, userId, reward.rows[0].reward.exp])
            if (!statResults.rows[0]) {
                console.info("Reward job skipped: reward already granted")
                await client.query("ROLLBACK");
                return;
            }

            // Get current progress
            const progressResult = await client.query("SELECT exp, exp_to_next_level, level FROM progress WHERE user_id = $1", [userId]);
            const progress = progressResult.rows[0];

            // Calulate new progress
            const newExp = progress.exp + reward.rows[0].reward.exp;

            const newLevel = levelFromExp(newExp);

            const nextLevelExp = expRequiredForLevel(newLevel + 1);

            // Upate progress
            const updateUserExp = 'UPDATE progress SET exp = $1, level = $2, exp_to_next_level = $3 WHERE user_id = $4 RETURNING *'
            const updateResults = await client.query(updateUserExp, [newExp, newLevel, nextLevelExp, userId])


            await client.query("COMMIT")


            sendSseEvent("reward_granted", {
                questId,
                userId,
                reward: reward.rows[0]
            });
            console.info("Quest reward granted successfully")
        } catch (error) {
            await client.query("ROLLBACK")
            console.error("Reward job failed")
            throw error;
        } finally {
            client.release()
        }
    })

}