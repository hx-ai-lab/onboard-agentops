/**
 * IndexedDB schema history. Keep entries append-only so future migrations are
 * auditable. Dexie applies the matching store definition in database.ts.
 */
export const schemaHistory = [
  { version: 1, description: "基础设置、最小演示记录和初始化元数据" },
] as const;
