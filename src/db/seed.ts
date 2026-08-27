import {
  FIXTURE_TIMESTAMP,
  initialDemoRecords,
  initialMeta,
  initialSettings,
} from "../data/fixtures";
import type { OnboardOpsDatabase } from "./database";

export async function initializeDatabase(
  database: OnboardOpsDatabase,
): Promise<"seeded" | "existing"> {
  await database.open();
  const initialized = await database.meta.get("initialized");
  if (initialized) return "existing";
  await resetDatabase(database);
  return "seeded";
}

export async function resetDatabase(
  database: OnboardOpsDatabase,
): Promise<void> {
  await database.transaction(
    "rw",
    database.settings,
    database.demoRecords,
    database.meta,
    async () => {
      await Promise.all([
        database.settings.clear(),
        database.demoRecords.clear(),
        database.meta.clear(),
      ]);
      await database.settings.bulkAdd(structuredClone(initialSettings));
      await database.demoRecords.bulkAdd(structuredClone(initialDemoRecords));
      await database.meta.bulkAdd([
        ...structuredClone(initialMeta),
        { key: "initialized", value: "true", updatedAt: FIXTURE_TIMESTAMP },
      ]);
    },
  );
}
