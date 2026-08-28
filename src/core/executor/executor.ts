import type { OnboardOpsDatabase } from "../../db/database"; import { executeLocalTool } from "../../features/tools/executor"; import type { ExecutionPlan, RiskResult, TraceStep, UserContext } from "../../types/persistence";
export async function executePlan(database:OnboardOpsDatabase,plan:ExecutionPlan,context:UserContext):Promise<{steps:TraceStep[];evidence:Array<{id:string;type:"tool"|"knowledge";capabilityId:string;data:unknown}>;riskResult:RiskResult;finalReply:string;status:TraceStep["status"]}> {
 const traces:TraceStep[]=[],evidence:Array<{id:string;type:"tool"|"knowledge";capabilityId:string;data:unknown}>=[]; let failed:TraceStep["status"]|undefined;
 for(const step of plan.steps){const start=performance.now(),startedAt=new Date().toISOString(); let status:TraceStep["status"]="success",output:unknown,errorMessage: string|undefined;
  if(step.type==="tool"){const result=await executeLocalTool(database,step.capabilityId,{...step.input,permissions:context.permissions});status=result.status;output=result.data;errorMessage=result.error;if(status==="success"){const id=`evidence-${step.id}`;evidence.push({id,type:step.capabilityId==="search_knowledge"?"knowledge":"tool",capabilityId:step.capabilityId,data:output});}else failed=status}
  else output=skillOutput(step.capabilityId,plan);
  const cap=step.type==="tool"?await database.tools.get(step.capabilityId):await database.skills.get(step.capabilityId);traces.push({stepId:step.id,stepType:step.type,capabilityId:step.capabilityId,capabilityVersion:cap?.version??0,input:step.input,output,startedAt,finishedAt:new Date().toISOString(),durationMs:Math.round(performance.now()-start),status,evidenceRefs:evidence.slice(-1).map(x=>x.id),...(errorMessage?{errorCode:status.toUpperCase(),errorMessage}:{})});
  if(status!=="success")break;
 }
 const privacy=plan.riskFlags.length>0; const handoff=plan.shouldHandoff||failed==="empty"; const riskResult:RiskResult=privacy?{decision:"block",flags:plan.riskFlags,message:"涉及敏感信息或越权查询，已安全阻断。"}:handoff?{decision:"handoff",flags:failed?[failed]:[],message:"信息不足或用户要求人工服务，已转接。"}:{decision:"allow",flags:[],message:"最终回复通过隐私与权限检查。"};
 const facts=evidence.filter(x=>x.capabilityId!=="search_knowledge").map(x=>JSON.stringify(x.data)).join("；");
 const finalReply=privacy?"抱歉，我不能提供完整敏感信息或查询其他员工资料。如需协助，请联系 HR 人工核验。":plan.missingInformation.length?"请提供您的员工编号（EMP-YYYY-NNNN），完成身份确认后我才能查询个人状态。":failed?`本次查询未取得可靠结果（${failed}），我不会猜测业务状态。请重试或转人工处理。`:handoff?"已记录人工服务请求，请等待 HR 跟进。":`已通过本地业务 Tool 核验：${facts||"暂无可核验事实"}。以上结果来自演示数据，请按相关知识指引办理。`;
 return {steps:traces,evidence,riskResult,finalReply,status:privacy||handoff?"success":failed??"success"};
}
function skillOutput(id:string,plan:ExecutionPlan){if(id==="identity-resolution")return {identified:!plan.missingInformation.length};if(id==="intent-extraction")return {intent:plan.intent,entities:plan.entities};if(id==="privacy-risk-check")return {flags:plan.riskFlags};return {processed:true,skill:id};}
