import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import {
  initialEmployees,
  initialKnowledgeDocuments,
  initialSkills,
  initialTools,
} from "../data/fixtures";
import { exportDatabase } from "../db/backup";
import { OnboardOpsDatabase } from "../db/database";
import { initializeDatabase, resetDatabase } from "../db/seed";
import { searchKnowledgeDocuments } from "./knowledge/search";
const names: string[] = [];
const make = () => {
  const name = `phase2-${crypto.randomUUID()}`;
  names.push(name);
  return new OnboardOpsDatabase(name);
};
afterEach(async () => {
  for (const name of names.splice(0))
    await new OnboardOpsDatabase(name).delete();
});
describe("phase 2 fixtures and migration", () => {
  it("initializes required catalogs and preserves user changes", async () => {
    const d = make();
    await initializeDatabase(d);
    expect(await d.employees.count()).toBeGreaterThanOrEqual(12);
    expect(await d.knowledgeDocuments.count()).toBeGreaterThanOrEqual(12);
    expect(await d.skills.count()).toBe(14);
    expect(await d.tools.count()).toBe(11);
    const employees = await d.employees.toArray();
    expect(new Set(employees.map((item) => item.city)).size).toBe(4);
    expect(new Set(employees.map((item) => item.onboardingStage)).size).toBe(4);
    const docs = await d.knowledgeDocuments.toArray();
    expect(new Set(docs.map((item) => item.category)).size).toBe(5);
    await d.settings.put({
      key: "user-setting",
      value: "keep",
      updatedAt: "now",
    });
    expect(await initializeDatabase(d)).toBe("existing");
    expect(await d.settings.get("user-setting")).toBeDefined();
    d.close();
  });
  it("migrates a v1 database without deleting v1 data", async () => {
    const d = make();
    d.close();
    const legacy = new Dexie(d.name);
    legacy.version(1).stores({
      settings: "&key",
      demoRecords: "&id, updatedAt",
      meta: "&key",
    });
    await legacy.open();
    await legacy
      .table("settings")
      .put({ key: "legacy", value: "preserved", updatedAt: "v1" });
    await legacy
      .table("meta")
      .put({ key: "initialized", value: "true", updatedAt: "v1" });
    legacy.close();
    const migrated = new OnboardOpsDatabase(d.name);
    await initializeDatabase(migrated);
    expect((await migrated.settings.get("legacy"))?.value).toBe("preserved");
    expect(await migrated.employees.count()).toBe(12);
    migrated.close();
  });
  it("resets all phase 2 tables idempotently and exports them", async () => {
    const d = make();
    await initializeDatabase(d);
    await d.employees.delete(initialEmployees[0].employeeId);
    await resetDatabase(d);
    const first = await exportDatabase(d);
    await resetDatabase(d);
    const second = await exportDatabase(d);
    for (const key of [
      "employees",
      "knowledgeDocuments",
      "skills",
      "skillVersions",
      "tools",
      "tickets",
    ] as const)
      expect(first[key]).toEqual(second[key]);
    expect(second.knowledgeDocuments).toEqual(initialKnowledgeDocuments);
    expect(second.skills).toEqual(initialSkills);
    expect(second.tools).toEqual(initialTools);
    d.close();
  });
});
describe("deterministic knowledge retrieval", () => {
  it("weights scopes and excludes expired or disabled documents", () => {
    const altered = [
      ...structuredClone(initialKnowledgeDocuments),
      {
        ...structuredClone(initialKnowledgeDocuments[0]),
        id: "expired",
        expiryDate: "2025-01-01",
      },
      {
        ...structuredClone(initialKnowledgeDocuments[0]),
        id: "disabled",
        enabled: false,
      },
    ];
    const hits = searchKnowledgeDocuments(altered, {
      query: "上海 报到",
      city: "上海",
      employeeType: "正式员工",
      scenario: "报到流程",
      now: "2026-08-27",
      topK: 20,
    });
    expect(hits[0].document.id).toBe("kb-shanghai");
    expect(
      hits.some(
        (x) => x.document.id === "expired" || x.document.id === "disabled",
      ),
    ).toBe(false);
  });
});
