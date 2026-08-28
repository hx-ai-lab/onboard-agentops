import type { OnboardOpsDatabase } from "../../db/database";
import type { Skill } from "../../types/persistence";
function stableHash(value:string){let hash=2166136261;for(const char of value){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}return `fnv1a-${(hash>>>0).toString(16)}`}
export async function saveSkill(database:OnboardOpsDatabase,id:string,changes:Pick<Skill,"prompt"|"changeNote">):Promise<Skill>{
  const current=await database.skills.get(id); if(!current) throw new Error("Skill 不存在");
  await database.skillSnapshots.put({...structuredClone(current),snapshotId:`${id}-v${current.version}-${crypto.randomUUID()}`,skillId:id,snapshotAt:new Date().toISOString()});
  const next={...current,...changes,version:current.version+1,updatedAt:new Date().toISOString(),hash:stableHash(changes.prompt)};
  await database.skills.put(next); return next;
}
export async function toggleSkill(database:OnboardOpsDatabase,id:string,enabled:boolean){await database.skills.update(id,{enabled,updatedAt:new Date().toISOString()})}
export async function rollbackSkill(database:OnboardOpsDatabase,snapshotId:string){
  const snapshot=await database.skillSnapshots.get(snapshotId); if(!snapshot) throw new Error("快照不存在");
  const current=await database.skills.get(snapshot.skillId); if(!current) throw new Error("Skill 不存在");
  await database.skillSnapshots.put({...current,snapshotId:`${current.id}-v${current.version}-${crypto.randomUUID()}`,skillId:current.id,snapshotAt:new Date().toISOString()});
  const {snapshotId:_snapshotId,skillId:_skillId,snapshotAt:_snapshotAt,...old}=snapshot; void _snapshotId; void _skillId; void _snapshotAt;
  const restored={...old,version:current.version+1,updatedAt:new Date().toISOString(),changeNote:`回滚至 v${snapshot.version}`}; await database.skills.put(restored); return restored;
}
export function lineDiff(before:string,after:string){const left=before.split("\n"),right=after.split("\n");return {removed:left.filter(x=>!right.includes(x)),added:right.filter(x=>!left.includes(x))}}
