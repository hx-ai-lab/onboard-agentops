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
export interface AgentConfig { id:string; name:string; audience:string; systemPrompt:string; businessBoundary:string; knowledgeIds:string[]; skillIds:string[]; toolIds:string[]; version:number; enabled:boolean; updatedAt:string }
export interface PlannerConfig { id:string; prompt:string; version:number; mandatoryCapabilities:string[]; allowedSkills:string[]; allowedTools:string[]; updatedAt:string }
export type ConfigKind="agent"|"planner";
export interface ConfigSnapshot { id:string; kind:ConfigKind; configId:string; version:number; content:string; createdAt:string; reason:string }
export const ROOT_CAUSES=["Planner 选错能力","Planner 缺少必要步骤","Skill Prompt 问题","Tool 数据或调用失败","知识缺失","知识过期","上下文不足","评分规则问题","模型输出不稳定","权限或隐私问题"] as const;
export type RootCause=typeof ROOT_CAUSES[number];
export interface HumanAnnotation { id:string; runId:string; correctness:number; groundedness:number; relevance:number; completeness:number; toolUse:number; safety:number; tone:number; overall:number; rootCause:RootCause; note:string; createdAt:string; updatedAt:string }
export interface UserRating { id:string; runId:string; score:number; note:string; createdAt:string }
export interface BadCase { id:string; runId:string; rootCause:RootCause; status:"open"|"improving"|"rerun"|"closed"; note:string; pendingEval:boolean; createdAt:string; updatedAt:string }
export interface ImprovementDraft { id:string; runId:string; targetKind:ConfigKind; targetId:string; suggestion:string; before:string; after:string; status:"draft"|"applied"; createdAt:string; appliedAt?:string; snapshotId?:string; rerunId?:string }
export type EvalStatus="PASS"|"FAIL"|"REVIEW"|"ERROR";
export interface KeywordGroup { operator:"AND"|"OR"; keywords:string[] }
export interface EvalCase { id:string;name:string;question:string;userContext:UserContext;scenario:string;category:string;difficulty:"easy"|"medium"|"hard";inputRiskLevel:"low"|"medium"|"high";expectedIntent:string;expectedBehavior:string;expectedReplyPoints:string[];expectedKeywordGroups:KeywordGroup[];forbiddenWords:string[];requiredCapabilities:string[];forbiddenCapabilities:string[];expectedEvidenceRefs:string[];expectedHandoff:boolean;expectedRiskDecision:"allow"|"block"|"handoff";evalDimensions:string[];judgePrompt:string;tags:string[];sourceRunId?:string;enabled:boolean;createdAt:string;updatedAt:string }
export interface EvalScore { id:string;caseId:string;status:EvalStatus;passed:boolean;overallScore:number;dimensionScores:Record<string,number>;reason:string;evidence:string[];keywordHits:string[];keywordMisses:string[];forbiddenHits:string[];capabilityHits:string[];capabilityMisses:string[];evidenceHits:string[];factualConflicts:string[];riskIssues:string[];durationMs:number;runId:string;scorerVersion:string;reviewedStatus?:"PASS"|"FAIL";reviewNote?:string;reviewedAt?:string }
export interface VersionSnapshot {agentVersion:string;agentHash:string;plannerVersion:string;plannerHash:string;skillVersions:Record<string,number>;skillHashes:Record<string,string>;toolVersions:Record<string,number>;toolHashes:Record<string,string>;knowledgeVersions:Record<string,number>;knowledgeHashes:Record<string,string>;scorerVersion:string;scorerHash:string;provider:string;model:string;params:Record<string,unknown>;dataVersion:string}
export interface EvalBatchResult {caseId:string;runId:string;scoreId:string;status:EvalStatus;category:string;replyHash:string;durationMs:number;version:VersionSnapshot;previousRunId?:string}
export interface EvalBatch {id:string;name:string;versionLabel:string;changeNote:string;caseIds:string[];caseSnapshot:EvalCase[];caseSetHash:string;version:VersionSnapshot;createdAt:string;startedAt?:string;finishedAt?:string;status:"queued"|"running"|"paused"|"done"|"error"|"cancelled";currentIndex:number;total:number;passed:number;failed:number;review:number;errors:number;caseResults:EvalBatchResult[]}
export interface EvalRegression {id:string;baselineBatchId:string;candidateBatchId:string;comparable:boolean;reasons:string[];fixed:string[];regressed:string[];persistentPass:string[];persistentFail:string[];toReview:string[];technicalErrorChanges:string[];replyChanged:string[];metricChanges:Record<string,number|null>;createdAt:string}
export type ReportKind="design"|"run"|"decision"|"package";
export interface ReportDraft {id:string;batchId:string;comparisonBatchId?:string;documentVersion:string;status:"草稿"|"已复核"|"已归档";creator:string;reviewer:string;requirementRef:string;reviewOpinion:string;designDecision:""|"通过"|"修改后通过"|"不通过";manualReviewConclusion:string;rootCause:string;rootCauseEvidence:string;excludedCauses:string;confidence:""|"高"|"中"|"低";changeGoal:string;changeTarget:string;minimalDiff:string;finalDecision:""|"建议发布"|"不建议发布"|"需要人工复核"|"暂停评测，先修复评测器或环境问题";decisionSummary:string;remainingRisks:string;followUpActions:string;roleReviews:string;updatedAt:string}
export interface ReportExportRecord {id:string;batchId:string;comparisonBatchId?:string;kind:ReportKind;format:"html"|"json"|"csv"|"print";fileName:string;createdAt:string}
export interface DemoBackup {
  schemaVersion: number; exportedAt: string; settings: AppSetting[]; demoRecords: DemoRecord[]; meta: DatabaseMeta[];
  employees: Employee[]; knowledgeDocuments: KnowledgeDocument[]; skills: Skill[]; skillSnapshots: SkillSnapshot[];
  tools: LocalTool[]; tickets: Ticket[]; runs: RunRecord[]; agents:AgentConfig[]; plannerConfigs:PlannerConfig[]; configSnapshots:ConfigSnapshot[]; humanAnnotations:HumanAnnotation[]; userRatings:UserRating[]; badCases:BadCase[]; improvementDrafts:ImprovementDraft[];evalCases:EvalCase[];evalScores:EvalScore[];evalBatches:EvalBatch[];evalRegressions:EvalRegression[];reportDrafts:ReportDraft[];reportExports:ReportExportRecord[];
}
