import { SCHEMA_VERSION } from "../data/fixtures";
import type { DemoBackup } from "../types/persistence";
import type { OnboardOpsDatabase } from "./database";

export async function exportDatabase(
  database: OnboardOpsDatabase,
): Promise<DemoBackup> {
  const [settings, demoRecords, meta] = await Promise.all([
    database.settings.toArray(),
    database.demoRecords.toArray(),
    database.meta.toArray(),
  ]);
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    demoRecords,
    meta,
  };
}

export async function importDatabase(
  database: OnboardOpsDatabase,
  backup: DemoBackup,
): Promise<void> {
  if (backup.schemaVersion !== SCHEMA_VERSION)
    throw new Error(`不支持的数据版本：${backup.schemaVersion}`);
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
      await database.settings.bulkAdd(backup.settings);
      await database.demoRecords.bulkAdd(backup.demoRecords);
      await database.meta.bulkAdd(backup.meta);
    },
  );
}
