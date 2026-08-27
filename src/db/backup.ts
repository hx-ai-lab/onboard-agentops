import { SCHEMA_VERSION } from "../data/fixtures";
import type { DemoBackup } from "../types/persistence";
import type { OnboardOpsDatabase } from "./database";
export async function exportDatabase(
  database: OnboardOpsDatabase,
): Promise<DemoBackup> {
  const [
    settings,
    demoRecords,
    meta,
    employees,
    knowledgeDocuments,
    skills,
    skillVersions,
    tools,
    tickets,
  ] = await Promise.all([
    database.settings.toArray(),
    database.demoRecords.toArray(),
    database.meta.toArray(),
    database.employees.toArray(),
    database.knowledgeDocuments.toArray(),
    database.skills.toArray(),
    database.skillVersions.toArray(),
    database.tools.toArray(),
    database.tickets.toArray(),
  ]);
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    demoRecords,
    meta,
    employees,
    knowledgeDocuments,
    skills,
    skillVersions,
    tools,
    tickets,
  };
}
export async function importDatabase(
  database: OnboardOpsDatabase,
  backup: DemoBackup,
): Promise<void> {
  if (backup.schemaVersion !== SCHEMA_VERSION)
    throw new Error(`不支持的数据版本：${backup.schemaVersion}`);
  const required = [
    "settings",
    "demoRecords",
    "meta",
    "employees",
    "knowledgeDocuments",
    "skills",
    "skillVersions",
    "tools",
    "tickets",
  ] as const;
  if (required.some((key) => !Array.isArray(backup[key])))
    throw new Error("备份数据结构不完整");
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
      await database.settings.bulkAdd(backup.settings);
      await database.demoRecords.bulkAdd(backup.demoRecords);
      await database.meta.bulkAdd(backup.meta);
      await database.employees.bulkAdd(backup.employees);
      await database.knowledgeDocuments.bulkAdd(backup.knowledgeDocuments);
      await database.skills.bulkAdd(backup.skills);
      await database.skillVersions.bulkAdd(backup.skillVersions);
      await database.tools.bulkAdd(backup.tools);
      await database.tickets.bulkAdd(backup.tickets);
    },
  );
}
