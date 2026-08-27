export type RuntimeMode = "demo" | "smart";
export interface AppSetting {
  key: string;
  value: string;
  updatedAt: string;
}
export interface DemoRecord {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
export interface DatabaseMeta {
  key: string;
  value: string;
  updatedAt: string;
}
export interface DemoBackup {
  schemaVersion: number;
  exportedAt: string;
  settings: AppSetting[];
  demoRecords: DemoRecord[];
  meta: DatabaseMeta[];
  employees: Employee[];
  knowledgeDocuments: KnowledgeDocument[];
  skills: SkillDefinition[];
  skillVersions: SkillVersion[];
  tools: ToolDefinition[];
  tickets: ServiceTicket[];
}

export type City = "上海" | "北京" | "广州" | "深圳";
export type OnboardingStage =
  | "Offer 接受"
  | "材料准备"
  | "到岗报到"
  | "入职后 30 天";
export type BusinessScenario =
  | "入职材料"
  | "报到流程"
  | "账号系统"
  | "培训安排"
  | "办公行政";
export type EmployeeType = "正式员工" | "外包员工";
export interface Employee {
  employeeId: string;
  name: string;
  maskedIdNumber: string;
  maskedBankNumber: string;
  maskedPhone: string;
  city: City;
  department: string;
  employeeType: EmployeeType;
  roleType: string;
  onboardingDate: string;
  onboardingStage: OnboardingStage;
  submittedDocuments: string[];
  missingDocuments: string[];
  documentReviewStatus: Record<string, string>;
  accountStatus: Record<string, string>;
  trainingStatus: string;
  trainingDate: string;
  deviceStatus: string;
  officeArrangement: string;
  assignedHr: string;
  permissions: string[];
  scenarioFlags: string[];
}
export interface KnowledgeDocument {
  id: string;
  title: string;
  category: BusinessScenario;
  cityScope: City[];
  employeeTypeScope: EmployeeType[];
  effectiveDate: string;
  expiryDate: string;
  version: string;
  status: "published" | "draft" | "expired";
  enabled: boolean;
  content: string;
  keywords: string[];
  sourceLabel: string;
  updatedAt: string;
}
export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  prompt: string;
  modelConfig: { provider: "fixture"; temperature: number };
  requiredTools: string[];
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
  changeNote: string;
  hash: string;
}
export interface SkillVersion extends SkillDefinition {
  snapshotId: string;
  skillId: string;
  snapshotAt: string;
}
export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  version: number;
  timeoutMs: number;
  permissions: string[];
  testInput: Record<string, unknown>;
  updatedAt: string;
}
export interface ServiceTicket {
  id: string;
  type: "hr_reminder" | "it_ticket" | "human_handoff";
  employeeId?: string;
  status: string;
  summary: string;
  createdAt: string;
}
