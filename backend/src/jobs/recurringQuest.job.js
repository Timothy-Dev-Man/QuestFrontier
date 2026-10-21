import { createQuest } from "../services/2_quests.service.js"
import { boss } from "../services/eventEmitter.js";

export function startRecurringQuestWorker() {
    // Process jobs as they are triggered by the pg-boss scheduler
    boss.work("recurring-quest", async (jobs) => {
        for (const job of jobs) {
            try {
                const {
                    userId,
                    questId,
                    title,
                    description,
                    difficulty,
                    type,
                    start,
                    deadline,
                } = job.data;

                const intervalMs =
                    type === "Daily"
                        ? 24 * 60 * 60 * 1000
                        : type === "Weekly"
                            ? 7 * 24 * 60 * 60 * 1000
                            : null;

                if (intervalMs === null) {
                    throw new Error(`Invalid recurring quest type: ${type}`);
                }

                const scheduledAt = new Date(job.createdOn ?? Date.now()).getTime();
                const originalStart = new Date(start).getTime();

                if (scheduledAt < originalStart) {
                    console.info("Recurring quest skipped: before start time")
                    continue;
                }

                const intervalsElapsed = Math.max(
                    1,
                    Math.floor((scheduledAt - originalStart) / intervalMs) + 1
                );

                const nextStart = new Date(originalStart + intervalsElapsed * intervalMs);

                const nextDeadline = new Date(
                    new Date(deadline).getTime() + intervalsElapsed * intervalMs
                );
                await createQuest(
                    userId,
                    {
                        questTitle: title,
                        time: nextStart,
                        deadline: nextDeadline,
                        type,
                        questDescription: description,
                        difficulty,
                        recurringParentId: questId,
                    },
                    false,
                    true
                );
                console.info("Recurring quest instance created successfully")

            } catch (err) {
                console.error("Recurring quest worker failed");
                throw err; // pg-boss will catch this and mark the job as failed/retry
            }
        }
    });
}
