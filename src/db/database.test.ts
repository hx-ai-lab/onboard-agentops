import { afterEach, describe, expect, it } from "vitest";
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
