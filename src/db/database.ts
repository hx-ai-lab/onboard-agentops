import Dexie, { type EntityTable } from "dexie";
import type { AppSetting, DatabaseMeta, DemoRecord, Employee, KnowledgeDocument, LocalTool, Skill, SkillSnapshot, Ticket } from "../types/persistence";
export class OnboardOpsDatabase extends Dexie {
  settings!: EntityTable<AppSetting,"key">; demoRecords!: EntityTable<DemoRecord,"id">; meta!: EntityTable<DatabaseMeta,"key">;
  employees!: EntityTable<Employee,"employeeId">; knowledgeDocuments!: EntityTable<KnowledgeDocument,"id">;
  skills!: EntityTable<Skill,"id">; skillSnapshots!: EntityTable<SkillSnapshot,"snapshotId">;
  tools!: EntityTable<LocalTool,"id">; tickets!: EntityTable<Ticket,"id">;
  constructor(name="onboardops") {
    super(name);
    this.version(1).stores({settings:"&key",demoRecords:"&id, updatedAt",meta:"&key"});
    this.version(2).stores({
      settings:"&key",demoRecords:"&id, updatedAt",meta:"&key",employees:"&employeeId,name,city,employeeType,onboardingStage",
      knowledgeDocuments:"&id,category,cityScope,employeeTypeScope,status,updatedAt",skills:"&id,enabled,updatedAt",
      skillSnapshots:"&snapshotId,skillId,snapshotAt",tools:"&id,enabled",tickets:"&id,employeeId,type,status,createdAt",
    }).upgrade(async tx => {
      await tx.table("meta").put({key:"schemaVersion",value:"2",updatedAt:new Date().toISOString()});
    });
  }
}
export const db=new OnboardOpsDatabase();
