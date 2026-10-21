import { createQuest } from "../services/2_quests.service.js"
import { boss } from "../services/eventEmitter.js";

export function startRecurringQuestWorker() {
    // Process jobs as they are triggered by the pg-boss scheduler
    boss.work("recurring-quest", async (jobs) => {
        for (const job of jobs) {
            console.log("Processing triggered recurring quest:", job.id);
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

                console.log("(startRecurringQuestWorker) Creating quest instance for ID:", questId);


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
                    console.log("Skipping recurring quest before its start time:", questId);
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

            } catch (err) {
                console.error("Recurring quest worker failed:", err);
                throw err; // pg-boss will catch this and mark the job as failed/retry
            }
        }
    });
}
