import Dexie, { type EntityTable } from "dexie";
import type {
  AppSetting,
  DatabaseMeta,
  DemoRecord,
} from "../types/persistence";

export class OnboardOpsDatabase extends Dexie {
  settings!: EntityTable<AppSetting, "key">;
  demoRecords!: EntityTable<DemoRecord, "id">;
  meta!: EntityTable<DatabaseMeta, "key">;
  constructor(name = "onboardops") {
    super(name);
    this.version(1).stores({
      settings: "&key",
      demoRecords: "&id, updatedAt",
      meta: "&key",
    });
  }
}
export const db = new OnboardOpsDatabase();
