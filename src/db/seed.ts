import {
  FIXTURE_TIMESTAMP,
  initialDemoRecords,
  initialEmployees,
  initialKnowledgeDocuments,
  initialMeta,
  initialSettings,
  initialSkills,
  initialTools,
} from "../data/fixtures";
import type { OnboardOpsDatabase } from "./database";
export async function initializeDatabase(
  database: OnboardOpsDatabase,
): Promise<"seeded" | "existing"> {
  await database.open();
  const initialized = await database.meta.get("initialized"),
    phase2 = await database.meta.get("phase2Seeded");
  if (initialized && phase2) return "existing";
  if (initialized) {
    await database.transaction(
      "rw",
      database.employees,
      database.knowledgeDocuments,
      database.skills,
      database.tools,
      database.meta,
      async () => {
        if ((await database.employees.count()) === 0)
          await database.employees.bulkAdd(structuredClone(initialEmployees));
        if ((await database.knowledgeDocuments.count()) === 0)
          await database.knowledgeDocuments.bulkAdd(
            structuredClone(initialKnowledgeDocuments),
          );
        if ((await database.skills.count()) === 0)
          await database.skills.bulkAdd(structuredClone(initialSkills));
        if ((await database.tools.count()) === 0)
          await database.tools.bulkAdd(structuredClone(initialTools));
        await database.meta.bulkPut([
          { key: "phase2Seeded", value: "true", updatedAt: FIXTURE_TIMESTAMP },
          { key: "schemaVersion", value: "2", updatedAt: FIXTURE_TIMESTAMP },
          {
            key: "fixtureVersion",
            value: "phase-2-v1",
            updatedAt: FIXTURE_TIMESTAMP,
          },
        ]);
      },
    );
    return "seeded";
  }
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
    database.employees,
    database.knowledgeDocuments,
    database.skills,
    database.skillVersions,
    database.tools,
    database.tickets,
    async () => {
      await Promise.all([
        database.settings.clear(),
        database.demoRecords.clear(),
        database.meta.clear(),
        database.employees.clear(),
        database.knowledgeDocuments.clear(),
        database.skills.clear(),
        database.skillVersions.clear(),
        database.tools.clear(),
        database.tickets.clear(),
      ]);
      await database.settings.bulkAdd(structuredClone(initialSettings));
      await database.demoRecords.bulkAdd(structuredClone(initialDemoRecords));
      await database.meta.bulkAdd([
        ...structuredClone(initialMeta),
        { key: "initialized", value: "true", updatedAt: FIXTURE_TIMESTAMP },
        { key: "phase2Seeded", value: "true", updatedAt: FIXTURE_TIMESTAMP },
      ]);
      await database.employees.bulkAdd(structuredClone(initialEmployees));
      await database.knowledgeDocuments.bulkAdd(
        structuredClone(initialKnowledgeDocuments),
      );
      await database.skills.bulkAdd(structuredClone(initialSkills));
      await database.tools.bulkAdd(structuredClone(initialTools));
    },
  );
}
