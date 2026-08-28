export type RuntimeMode = "demo" | "smart";
export interface AppSetting { key: string; value: string; updatedAt: string }
export interface DemoRecord { id: string; title: string; note: string; createdAt: string; updatedAt: string }
export interface DatabaseMeta { key: string; value: string; updatedAt: string }
export type City = "上海" | "北京" | "广州" | "深圳";
export interface Employee {
  employeeId: string; name: string; maskedIdNumber: string; city: City; department: string;
  employeeType: "正式员工" | "外包员工"; roleType: string; onboardingDate: string; onboardingStage: string;
  submittedDocuments: string[]; missingDocuments: string[]; documentReviewStatus: Record<string,string>;
  accountStatus: Record<string,string>; trainingStatus: string; deviceStatus: string; assignedHr: string;
  permissions: string[]; officeArrangement: string;
}
export interface KnowledgeDocument {
  id: string; title: string; category: string; cityScope: City | "全国"; employeeTypeScope: "正式员工" | "外包员工" | "全部";
  effectiveDate: string; expiryDate: string; version: number; status: "active" | "disabled"; content: string;
  keywords: string[]; sourceLabel: string; updatedAt: string;
}
export interface ModelConfig { provider: "fixture"; temperature: number }
export interface Skill {
  id: string; name: string; description: string; enabled: boolean; prompt: string; modelConfig: ModelConfig;
  requiredTools: string[]; inputSchema: string; outputSchema: string; version: number; createdAt: string;
  updatedAt: string; changeNote: string; hash: string;
}
export interface SkillSnapshot extends Skill { snapshotId: string; skillId: string; snapshotAt: string }
export interface LocalTool {
  id: string; name: string; description: string; enabled: boolean; inputSchema: string; outputSchema: string;
  version: number; timeoutMs: number; permissions: string[]; testInput: string;
}
export interface Ticket { id: string; employeeId: string; type: "HR提醒" | "IT工单" | "人工转接"; summary: string; status: string; createdAt: string }
export interface DemoBackup {
  schemaVersion: number; exportedAt: string; settings: AppSetting[]; demoRecords: DemoRecord[]; meta: DatabaseMeta[];
  employees: Employee[]; knowledgeDocuments: KnowledgeDocument[]; skills: Skill[]; skillSnapshots: SkillSnapshot[];
  tools: LocalTool[]; tickets: Ticket[];
}
