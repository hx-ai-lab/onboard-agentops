import { afterEach, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { initialDemoRecords } from "../data/fixtures";
import { exportDatabase } from "./backup";
import { OnboardOpsDatabase } from "./database";
import { initializeDatabase, resetDatabase } from "./seed";

const names: string[] = [];
function createDatabase() {
  const name = `onboardops-test-${crypto.randomUUID()}`;
  names.push(name);
  return new OnboardOpsDatabase(name);
}
afterEach(async () => {
  for (const name of names.splice(0))
    await new OnboardOpsDatabase(name).delete();
});

describe("IndexedDB lifecycle", () => {
  it("detects first initialization and does not overwrite existing data", async () => {
    const database = createDatabase();
    expect(await initializeDatabase(database)).toBe("seeded");
    await database.demoRecords.add({
      id: "custom",
      title: "持久化记录",
      note: "test",
      createdAt: "2026-08-27T01:00:00.000Z",
      updatedAt: "2026-08-27T01:00:00.000Z",
    });
    expect(await initializeDatabase(database)).toBe("existing");
    expect(await database.demoRecords.get("custom")).toBeDefined();
    database.close();
  });
  it("persists writes after the database is closed and reopened", async () => {
    const database = createDatabase();
    const name = database.name;
    await initializeDatabase(database);
    await database.settings.put({
      key: "persisted",
      value: "yes",
      updatedAt: "2026-08-27T01:00:00.000Z",
    });
    database.close();
    const reopened = new OnboardOpsDatabase(name);
    expect((await reopened.settings.get("persisted"))?.value).toBe("yes");
    reopened.close();
  });
  it("produces identical fixture data after repeated resets", async () => {
    const database = createDatabase();
    await initializeDatabase(database);
    await database.demoRecords.clear();
    await resetDatabase(database);
    const first = await exportDatabase(database);
    await resetDatabase(database);
    const second = await exportDatabase(database);
    expect(first.settings).toEqual(second.settings);
    expect(first.demoRecords).toEqual(second.demoRecords);
    expect(first.meta).toEqual(second.meta);
    expect(second.demoRecords).toEqual(initialDemoRecords);
    database.close();
  });
});

describe("phase 3 migration", () => {
  it("upgrades a real v2 database non-destructively and persists runs store", async () => {
    const name = `phase3-v2-${crypto.randomUUID()}`;
    const legacy = new Dexie(name);
    legacy.version(2).stores({settings:"&key",demoRecords:"&id, updatedAt",meta:"&key",employees:"&employeeId,name,city,employeeType,onboardingStage",knowledgeDocuments:"&id,category,cityScope,employeeTypeScope,status,updatedAt",skills:"&id,enabled,updatedAt",skillSnapshots:"&snapshotId,skillId,snapshotAt",tools:"&id,enabled",tickets:"&id,employeeId,type,status,createdAt"});
    await legacy.open();
    await legacy.table("settings").put({key:"user-change",value:"preserved",updatedAt:"2026-01-01"});
    await legacy.table("meta").put({key:"initialized",value:"true",updatedAt:"2026-01-01"});
    legacy.close();
    const migrated=new OnboardOpsDatabase(name);await initializeDatabase(migrated);
    expect((await migrated.settings.get("user-change"))?.value).toBe("preserved");
    expect((await migrated.meta.get("schemaVersion"))?.value).toBe("4");expect(await migrated.runs.count()).toBe(0);
    migrated.close();await Dexie.delete(name);
  });
});

describe("phase 4 migration",()=>{it("upgrades a real v3 database without destroying legacy rows",async()=>{const name=`phase4-v3-${crypto.randomUUID()}`;const legacy=new Dexie(name);legacy.version(3).stores({settings:"&key",demoRecords:"&id, updatedAt",meta:"&key",employees:"&employeeId,name,city,employeeType,onboardingStage",knowledgeDocuments:"&id,category,cityScope,employeeTypeScope,status,updatedAt",skills:"&id,enabled,updatedAt",skillSnapshots:"&snapshotId,skillId,snapshotAt",tools:"&id,enabled",tickets:"&id,employeeId,type,status,createdAt",runs:"&id,createdAt,status,conversationId,source,userContextSnapshot.employeeId"});await legacy.open();await legacy.table("settings").put({key:"user-v3",value:"preserved",updatedAt:"2026"});await legacy.table("meta").put({key:"initialized",value:"true",updatedAt:"2026"});legacy.close();const migrated=new OnboardOpsDatabase(name);await initializeDatabase(migrated);expect((await migrated.settings.get("user-v3"))?.value).toBe("preserved");expect((await migrated.meta.get("schemaVersion"))?.value).toBe("4");expect(await migrated.agents.count()).toBe(1);expect(await migrated.plannerConfigs.count()).toBe(1);migrated.close();await Dexie.delete(name)})});
