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
export type ExecutionStatus = "success" | "empty" | "permission_denied" | "timeout" | "malformed" | "disabled" | "error";
export interface UserContext { employeeId?: string; name?: string; permissions: string[] }
export interface PlanStep { id:string; type:"skill"|"tool"; capabilityId:string; input:Record<string,unknown>; dependsOn:string[] }
export interface ExecutionPlan { intent:string; entities:Record<string,string>; missingInformation:string[]; selectedSkills:string[]; selectedTools:string[]; steps:PlanStep[]; mandatoryCapabilities:string[]; riskFlags:string[]; reasoningSummary:string; fallback:"clarify"|"handoff"|"safe_reply"; shouldHandoff:boolean }
export interface PlanValidation { valid:boolean; errors:Array<{code:string;message:string;stepId?:string}>; warnings:Array<{code:string;message:string}> }
export interface TraceStep { stepId:string; stepType:"skill"|"tool"; capabilityId:string; capabilityVersion:number; input:unknown; output?:unknown; startedAt:string; finishedAt:string; durationMs:number; status:ExecutionStatus; evidenceRefs:string[]; errorCode?:string; errorMessage?:string }
export interface RiskResult { decision:"allow"|"block"|"handoff"; flags:string[]; message:string }
export interface RunRecord { id:string; question:string; conversationId:string; userContextSnapshot:UserContext; source:"workspace"|"chat"; createdAt:string; status:ExecutionStatus; finalReply:string; plan:ExecutionPlan; planValidation:PlanValidation; steps:TraceStep[]; evidence:Array<{id:string;type:"tool"|"knowledge";capabilityId:string;data:unknown}>; riskResult:RiskResult; durationMs:number; error?:{code:string;message:string}; provider:"fixture"; model:"deterministic-rules"; agentVersion:string; plannerVersion:string; skillVersions:Record<string,number>; toolVersions:Record<string,number>; knowledgeVersions:Record<string,number> }
export interface DemoBackup {
  schemaVersion: number; exportedAt: string; settings: AppSetting[]; demoRecords: DemoRecord[]; meta: DatabaseMeta[];
  employees: Employee[]; knowledgeDocuments: KnowledgeDocument[]; skills: Skill[]; skillSnapshots: SkillSnapshot[];
  tools: LocalTool[]; tickets: Ticket[]; runs: RunRecord[];
}
