import { db } from "../../db/database";
import type { SkillDefinition, SkillVersion } from "../../types/persistence";
export function diffSkill(a: SkillDefinition, b: SkillDefinition) {
  return {
    promptChanged: a.prompt !== b.prompt,
    enabledChanged: a.enabled !== b.enabled,
    toolsChanged:
      JSON.stringify(a.requiredTools) !== JSON.stringify(b.requiredTools),
    fromVersion: a.version,
    toVersion: b.version,
  };
}
export async function saveSkill(next: SkillDefinition) {
  const current = await db.skills.get(next.id);
  if (!current) throw new Error("Skill 不存在");
  const snapshot: SkillVersion = {
    ...structuredClone(current),
    snapshotId: crypto.randomUUID(),
    skillId: current.id,
    snapshotAt: new Date().toISOString(),
  };
  await db.transaction("rw", db.skills, db.skillVersions, async () => {
    await db.skillVersions.add(snapshot);
    await db.skills.put({
      ...next,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      hash: `${next.id}-v${current.version + 1}-${simpleHash(next.prompt)}`,
    });
  });
}
export async function rollbackSkill(skillId: string, snapshotId: string) {
  const snapshot = await db.skillVersions.get(snapshotId),
    current = await db.skills.get(skillId);
  if (!snapshot || !current) throw new Error("版本不存在");
  const {
    snapshotId: _snapshotId,
    skillId: _skillId,
    snapshotAt: _snapshotAt,
    ...definition
  } = snapshot;
  void _snapshotId;
  void _skillId;
  void _snapshotAt;
  await saveSkill({
    ...definition,
    id: skillId,
    version: current.version,
    changeNote: `回滚至 v${snapshot.version}`,
  });
}
function simpleHash(value: string) {
  let h = 0;
  for (const c of value) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16);
}
