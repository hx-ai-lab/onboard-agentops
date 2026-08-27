export type RuntimeMode = "demo" | "smart";
export interface AppSetting {
  key: string;
  value: string;
  updatedAt: string;
}
export interface DemoRecord {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
export interface DatabaseMeta {
  key: string;
  value: string;
  updatedAt: string;
}
export interface DemoBackup {
  schemaVersion: number;
  exportedAt: string;
  settings: AppSetting[];
  demoRecords: DemoRecord[];
  meta: DatabaseMeta[];
}
