import type { ExecutionPlan, LocalTool, PlanValidation, Skill, UserContext } from "../../types/persistence";
export function validatePlan(plan:ExecutionPlan,skills:Skill[],tools:LocalTool[],context:UserContext):PlanValidation {
 const errors:PlanValidation["errors"]=[],warnings:PlanValidation["warnings"]=[]; const available=new Map([...skills,...tools].map(x=>[x.id,x.enabled]));
 for(const step of plan.steps)if(!available.has(step.capabilityId)||!available.get(step.capabilityId))errors.push({code:"CAPABILITY_UNAVAILABLE",message:`能力不存在或未启用：${step.capabilityId}`,stepId:step.id});
 const picked=new Set([...plan.selectedSkills,...plan.selectedTools]); for(const id of plan.mandatoryCapabilities)if(!picked.has(id))errors.push({code:"MANDATORY_CAPABILITY_MISSING",message:`缺少必需能力：${id}`});
 if(!context.employeeId&&plan.steps.some(x=>x.type==="tool"&&x.capabilityId.startsWith("get_")))errors.push({code:"IDENTITY_REQUIRED",message:"身份未确认，禁止查询个人状态"});
 if(plan.riskFlags.includes("other_employee"))errors.push({code:"OTHER_EMPLOYEE_BLOCKED",message:"禁止查询其他员工信息"});
 if(plan.riskFlags.length&&!plan.selectedSkills.includes("privacy-risk-check"))errors.push({code:"PRIVACY_CHECK_REQUIRED",message:"风险场景必须执行隐私检查"});
 if(["document_status","account_status","training_schedule","office_arrangement"].includes(plan.intent)&&!plan.selectedTools.some(x=>x.startsWith("get_"))&&!plan.riskFlags.length&&!plan.missingInformation.length)errors.push({code:"STATUS_TOOL_REQUIRED",message:"精确业务状态必须来自 Tool"});
 if(!plan.selectedTools.includes("search_knowledge")&&!plan.riskFlags.length)warnings.push({code:"KNOWLEDGE_NOT_SEARCHED",message:"未检索最新知识"});
 return {valid:errors.length===0,errors,warnings};
}
