import type { Employee, ExecutionPlan, KnowledgeDocument, LocalTool, Skill, UserContext } from "../../types/persistence";
export interface PlannerInput { userInput:string; conversationHistory:string[]; userContext:UserContext; employee?:Employee; availableSkills:Skill[]; availableTools:LocalTool[]; availableKnowledge:KnowledgeDocument[]; mandatoryCapabilities:string[] }
const has=(s:string,...words:string[])=>words.some(w=>s.includes(w));
export function createPlan(input:PlannerInput):ExecutionPlan {
  const q=input.userInput.trim(); const skills=new Set(input.availableSkills.filter(x=>x.enabled).map(x=>x.id)); const tools=new Set(input.availableTools.filter(x=>x.enabled).map(x=>x.id));
  const sensitive=has(q,"身份证号","银行卡号","手机号","完整身份证","完整银行卡");
  const other=has(q,"其他员工","别人","同事") || (!!input.employee && /EMP-\d{4}-\d{4}/.test(q) && !q.includes(input.employee.employeeId));
  const explicitHuman=has(q,"人工","真人","投诉");
  let intent="onboarding_guidance", tool="get_onboarding_checklist", guide="document-check";
  if(has(q,"邮箱","OA","VPN","账号","登录")){intent="account_status";tool="get_account_status";guide="account-troubleshooting"}
  else if(has(q,"培训","课程")){intent="training_schedule";tool="get_training_schedule";guide="training-guidance"}
  else if(has(q,"设备","工牌","办公")){intent="office_arrangement";tool="get_office_arrangement";guide="office-admin-guidance"}
  else if(has(q,"材料","缺什么","证明")){intent="document_status";tool="get_onboarding_checklist";guide="document-check"}
  const riskFlags=[...(sensitive?["sensitive_information"]:[]),...(other?["other_employee"]:[])];
  const selectedSkills=["identity-resolution","intent-extraction",guide,"response-generator","privacy-risk-check"].filter(x=>skills.has(x));
  const selectedTools:string[]=[]; if(tools.has(tool))selectedTools.push(tool); if(tools.has("search_knowledge"))selectedTools.push("search_knowledge");
  const missingInformation=!input.userContext.employeeId?["employeeId"]:[]; const shouldHandoff=explicitHuman;
  const steps:ExecutionPlan["steps"]=[]; let n=1; for(const id of selectedSkills.slice(0,2))steps.push({id:`step-${n++}`,type:"skill" as const,capabilityId:id,input:{question:q},dependsOn:n===2?[]:[`step-${n-2}`]});
  if(!sensitive&&!other&&!missingInformation.length){for(const id of selectedTools)steps.push({id:`step-${n++}`,type:"tool" as const,capabilityId:id,input:id==="search_knowledge"?{query:q,city:input.employee?.city,employeeType:input.employee?.employeeType}:{employeeId:input.userContext.employeeId},dependsOn:[`step-${n-2}`]})}
  if(explicitHuman&&tools.has("transfer_to_human")){selectedTools.push("transfer_to_human");steps.push({id:`step-${n++}`,type:"tool",capabilityId:"transfer_to_human",input:{employeeId:input.userContext.employeeId,summary:q},dependsOn:steps.length?[steps.at(-1)!.id]:[]})}
  for(const id of selectedSkills.slice(2))steps.push({id:`step-${n++}`,type:"skill",capabilityId:id,input:{question:q},dependsOn:steps.length?[steps.at(-1)!.id]:[]});
  return {intent,entities:{...(input.userContext.employeeId?{employeeId:input.userContext.employeeId}:{}),...(input.employee?{city:input.employee.city}: {})},missingInformation,selectedSkills,selectedTools,steps,mandatoryCapabilities:input.mandatoryCapabilities,riskFlags,reasoningSummary:riskFlags.length?"检测到隐私或越权风险，优先安全审核。":missingInformation.length?"身份信息不足，先澄清员工编号。":"已按意图选择精确状态 Tool、知识检索与最终隐私审核。",fallback:explicitHuman?"handoff":missingInformation.length?"clarify":"safe_reply",shouldHandoff};
}
