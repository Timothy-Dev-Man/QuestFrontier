ALTER TABLE quests
ADD COLUMN recurring_parent_id INTEGER REFERENCES quests(id);

CREATE UNIQUE INDEX IF NOT EXISTS quests_unique_recurring_occurrence
ON quests (recurring_parent_id, start)
WHERE recurring_parent_id IS NOT NULL;