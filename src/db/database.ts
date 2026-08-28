import Dexie, { type EntityTable } from "dexie";
import type { AgentConfig, AppSetting, BadCase, ConfigSnapshot, DatabaseMeta, DemoRecord, Employee, HumanAnnotation, ImprovementDraft, KnowledgeDocument, LocalTool, PlannerConfig, RunRecord, Skill, SkillSnapshot, Ticket, UserRating } from "../types/persistence";
export class OnboardOpsDatabase extends Dexie {
  settings!: EntityTable<AppSetting,"key">; demoRecords!: EntityTable<DemoRecord,"id">; meta!: EntityTable<DatabaseMeta,"key">;
  employees!: EntityTable<Employee,"employeeId">; knowledgeDocuments!: EntityTable<KnowledgeDocument,"id">;
  skills!: EntityTable<Skill,"id">; skillSnapshots!: EntityTable<SkillSnapshot,"snapshotId">;
  tools!: EntityTable<LocalTool,"id">; tickets!: EntityTable<Ticket,"id">;
  runs!: EntityTable<RunRecord,"id">;
  agents!:EntityTable<AgentConfig,"id">; plannerConfigs!:EntityTable<PlannerConfig,"id">; configSnapshots!:EntityTable<ConfigSnapshot,"id">; humanAnnotations!:EntityTable<HumanAnnotation,"id">; userRatings!:EntityTable<UserRating,"id">; badCases!:EntityTable<BadCase,"id">; improvementDrafts!:EntityTable<ImprovementDraft,"id">;
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
    this.version(3).stores({
      settings:"&key",demoRecords:"&id, updatedAt",meta:"&key",employees:"&employeeId,name,city,employeeType,onboardingStage",
      knowledgeDocuments:"&id,category,cityScope,employeeTypeScope,status,updatedAt",skills:"&id,enabled,updatedAt",
      skillSnapshots:"&snapshotId,skillId,snapshotAt",tools:"&id,enabled",tickets:"&id,employeeId,type,status,createdAt",
      runs:"&id,createdAt,status,conversationId,source,userContextSnapshot.employeeId",
    }).upgrade(async tx => { await tx.table("meta").put({key:"schemaVersion",value:"3",updatedAt:new Date().toISOString()}); });
    this.version(4).stores({settings:"&key",demoRecords:"&id, updatedAt",meta:"&key",employees:"&employeeId,name,city,employeeType,onboardingStage",knowledgeDocuments:"&id,category,cityScope,employeeTypeScope,status,updatedAt",skills:"&id,enabled,updatedAt",skillSnapshots:"&snapshotId,skillId,snapshotAt",tools:"&id,enabled",tickets:"&id,employeeId,type,status,createdAt",runs:"&id,createdAt,status,conversationId,source,userContextSnapshot.employeeId",agents:"&id,enabled,updatedAt",plannerConfigs:"&id,updatedAt",configSnapshots:"&id,[kind+configId],createdAt",humanAnnotations:"&id,runId,rootCause,updatedAt",userRatings:"&id,runId,createdAt",badCases:"&id,runId,rootCause,status,pendingEval,updatedAt",improvementDrafts:"&id,runId,targetKind,targetId,status,createdAt"}).upgrade(async tx=>{await tx.table("meta").put({key:"schemaVersion",value:"4",updatedAt:new Date().toISOString()})});
  }
}
export const db=new OnboardOpsDatabase();
