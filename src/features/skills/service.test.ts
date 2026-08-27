import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OnboardOpsDatabase, db } from "../../db/database";
import { initializeDatabase } from "../../db/seed";
import { diffSkill, rollbackSkill, saveSkill } from "./service";
beforeAll(async () => {
  await db.delete();
  await initializeDatabase(db);
});
afterAll(async () => {
  db.close();
  await new OnboardOpsDatabase("onboardops").delete();
});
describe("Skill version service", () => {
  it("persists edits with a prior snapshot and can roll back", async () => {
    const original = (await db.skills.get("document-check"))!;
    await saveSkill({
      ...original,
      prompt: "修改后的确定性 Prompt",
      changeNote: "测试修改",
    });
    const changed = (await db.skills.get(original.id))!,
      snapshot = (await db.skillVersions
        .where("skillId")
        .equals(original.id)
        .first())!;
    expect(changed.prompt).toBe("修改后的确定性 Prompt");
    expect(snapshot.prompt).toBe(original.prompt);
    expect(diffSkill(snapshot, changed).promptChanged).toBe(true);
    await rollbackSkill(original.id, snapshot.snapshotId);
    expect((await db.skills.get(original.id))?.prompt).toBe(original.prompt);
  });
  it("persists disabled state in IndexedDB", async () => {
    const skill = (await db.skills.get("intent-extraction"))!;
    await saveSkill({ ...skill, enabled: false, changeNote: "停用测试" });
    expect(
      (await db.skills.toArray())
        .filter((item) => item.enabled)
        .some((item) => item.id === skill.id),
    ).toBe(false);
  });
});
