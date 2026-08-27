import type {
  AppSetting,
  DatabaseMeta,
  DemoRecord,
} from "../../types/persistence";
export const SCHEMA_VERSION = 1;
export const FIXTURE_TIMESTAMP = "2026-08-27T00:00:00.000Z";
export const initialSettings: AppSetting[] = [
  { key: "runtimeMode", value: "demo", updatedAt: FIXTURE_TIMESTAMP },
];
export const initialDemoRecords: DemoRecord[] = [
  {
    id: "welcome",
    title: "欢迎使用 OnboardOps",
    note: "这是用于验证 IndexedDB 持久化的最小演示记录。",
    createdAt: FIXTURE_TIMESTAMP,
    updatedAt: FIXTURE_TIMESTAMP,
  },
];
export const initialMeta: DatabaseMeta[] = [
  {
    key: "schemaVersion",
    value: String(SCHEMA_VERSION),
    updatedAt: FIXTURE_TIMESTAMP,
  },
  { key: "fixtureVersion", value: "phase-1-v1", updatedAt: FIXTURE_TIMESTAMP },
];
