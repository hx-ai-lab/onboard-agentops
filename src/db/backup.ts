import { SCHEMA_VERSION } from "../data/fixtures";
import type { DemoBackup } from "../types/persistence";
import type { OnboardOpsDatabase } from "./database";
export async function exportDatabase(database:OnboardOpsDatabase):Promise<DemoBackup>{
  const [settings,demoRecords,meta,employees,knowledgeDocuments,skills,skillSnapshots,tools,tickets]=await Promise.all([database.settings.toArray(),database.demoRecords.toArray(),database.meta.toArray(),database.employees.toArray(),database.knowledgeDocuments.toArray(),database.skills.toArray(),database.skillSnapshots.toArray(),database.tools.toArray(),database.tickets.toArray()]);
  return {schemaVersion:SCHEMA_VERSION,exportedAt:new Date().toISOString(),settings,demoRecords,meta,employees,knowledgeDocuments,skills,skillSnapshots,tools,tickets};
}
export async function importDatabase(database:OnboardOpsDatabase,backup:DemoBackup):Promise<void>{
  if(backup.schemaVersion!==SCHEMA_VERSION) throw new Error(`不支持的数据版本：${backup.schemaVersion}`);
  const required=["settings","demoRecords","meta","employees","knowledgeDocuments","skills","skillSnapshots","tools","tickets"] as const;
  if(required.some(key=>!Array.isArray(backup[key]))) throw new Error("备份结构不完整");
  await database.transaction("rw",[database.settings,database.demoRecords,database.meta,database.employees,database.knowledgeDocuments,database.skills,database.skillSnapshots,database.tools,database.tickets],async()=>{
    await Promise.all(required.map(key=>database.table(key).clear()));
    for(const key of required) await database.table(key).bulkAdd(structuredClone(backup[key]));
  });
}
