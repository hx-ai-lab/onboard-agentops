import Dexie, { type EntityTable } from "dexie";
import type {
  AppSetting,
  DatabaseMeta,
  DemoRecord,
  Employee,
  KnowledgeDocument,
  ServiceTicket,
  SkillDefinition,
  SkillVersion,
  ToolDefinition,
} from "../types/persistence";
export class OnboardOpsDatabase extends Dexie {
  settings!: EntityTable<AppSetting, "key">;
  demoRecords!: EntityTable<DemoRecord, "id">;
  meta!: EntityTable<DatabaseMeta, "key">;
  employees!: EntityTable<Employee, "employeeId">;
  knowledgeDocuments!: EntityTable<KnowledgeDocument, "id">;
  skills!: EntityTable<SkillDefinition, "id">;
  skillVersions!: EntityTable<SkillVersion, "snapshotId">;
  tools!: EntityTable<ToolDefinition, "id">;
  tickets!: EntityTable<ServiceTicket, "id">;
  constructor(name = "onboardops") {
    super(name);
    this.version(1).stores({
      settings: "&key",
      demoRecords: "&id, updatedAt",
      meta: "&key",
    });
    this.version(2).stores({
      settings: "&key",
      demoRecords: "&id, updatedAt",
      meta: "&key",
      employees: "&employeeId,name,city,employeeType,onboardingStage",
      knowledgeDocuments: "&id,category,*cityScope,*employeeTypeScope,status",
      skills: "&id,name",
      skillVersions: "&snapshotId,skillId,version,snapshotAt",
      tools: "&id,name",
      tickets: "&id,type,employeeId,status,createdAt",
    });
  }
}
export const db = new OnboardOpsDatabase();
