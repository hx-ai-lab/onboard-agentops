import type { OnboardOpsDatabase } from "../../db/database";
import { searchKnowledge } from "../knowledge/search";
export type ToolStatus="success"|"empty"|"permission_denied"|"timeout"|"malformed"|"disabled"|"error";
export interface ToolResult {status:ToolStatus;data?:unknown;error?:string;durationMs:number}
export interface ToolInput {employeeId?:string;query?:string;city?:string;employeeType?:string;summary?:string;permissions?:string[];inject?:Exclude<ToolStatus,"success"|"disabled">}
export async function executeLocalTool(database:OnboardOpsDatabase,toolId:string,input:ToolInput):Promise<ToolResult>{
  const started=performance.now(); const done=(status:ToolStatus,data?:unknown,error?:string):ToolResult=>({status,data,error,durationMs:Math.round(performance.now()-started)});
  try {
    const tool=await database.tools.get(toolId); if(!tool) return done("error",undefined,"Tool 不存在"); if(!tool.enabled)return done("disabled",undefined,"Tool 已停用");
    if(input.inject==="timeout") return done("timeout",undefined,`超过 ${tool.timeoutMs}ms`); if(input.inject==="malformed")return done("malformed","invalid","返回结构不符合 outputSchema"); if(input.inject==="error")return done("error",undefined,"注入的本地执行异常"); if(input.inject==="empty")return done("empty",[]);
    if(input.inject==="permission_denied"||!tool.permissions.every(p=>(input.permissions??tool.permissions).includes(p)))return done("permission_denied",undefined,"权限不足");
    if(toolId==="search_knowledge") return done("success",searchKnowledge(await database.knowledgeDocuments.toArray(),{query:input.query??"",city:input.city,employeeType:input.employeeType}));
    const employee=input.employeeId?await database.employees.get(input.employeeId):undefined;
    if(toolId.startsWith("get_")&&!employee)return done("empty",[]);
    const values:Record<string,unknown>={get_employee_profile:employee,get_onboarding_checklist:{employeeId:employee?.employeeId,employeeType:employee?.employeeType,missingDocuments:employee?.missingDocuments},get_submitted_documents:employee?.submittedDocuments,get_document_review_status:employee?.documentReviewStatus,get_account_status:employee?.accountStatus,get_training_schedule:{date:employee?.onboardingDate,status:employee?.trainingStatus},get_office_arrangement:{city:employee?.city,deviceStatus:employee?.deviceStatus,arrangement:employee?.officeArrangement}};
    if(toolId in values)return done("success",values[toolId]);
    const types={create_hr_reminder:"HR提醒",create_it_ticket:"IT工单",transfer_to_human:"人工转接"} as const; const type=types[toolId as keyof typeof types]; if(!type)return done("error",undefined,"未实现的 Tool");
    const ticket={id:`TKT-${crypto.randomUUID()}`,employeeId:input.employeeId??"UNKNOWN",type,summary:input.summary??"未填写",status:"已创建",createdAt:new Date().toISOString()}; await database.tickets.add(ticket); return done("success",ticket);
  }catch(error){return done("error",undefined,error instanceof Error?error.message:"未知错误")}
}
