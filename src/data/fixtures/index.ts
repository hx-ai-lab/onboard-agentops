import type { AppSetting, DatabaseMeta, DemoRecord, Employee, KnowledgeDocument, LocalTool, Skill } from "../../types/persistence";
export const SCHEMA_VERSION = 4;
export const FIXTURE_TIMESTAMP = "2026-08-27T00:00:00.000Z";
export const initialSettings: AppSetting[] = [{ key: "runtimeMode", value: "demo", updatedAt: FIXTURE_TIMESTAMP }];
export const initialDemoRecords: DemoRecord[] = [{ id:"welcome", title:"欢迎使用 OnboardOps", note:"这是用于验证 IndexedDB 持久化的最小演示记录。", createdAt:FIXTURE_TIMESTAMP, updatedAt:FIXTURE_TIMESTAMP }];
export const initialMeta: DatabaseMeta[] = [{key:"schemaVersion",value:"4",updatedAt:FIXTURE_TIMESTAMP},{key:"fixtureVersion",value:"phase-4-v4",updatedAt:FIXTURE_TIMESTAMP}];

const base = { maskedIdNumber:"310***********1234", department:"销售渠道部", employeeType:"正式员工" as const, roleType:"一线销售", onboardingStage:"材料准备", submittedDocuments:["身份证","学历证明","证件照","银行卡信息"], missingDocuments:[] as string[], documentReviewStatus:{身份证:"通过",学历证明:"通过"}, accountStatus:{email:"已开通",oa:"已开通",vpn:"已开通"}, trainingStatus:"已同步", deviceStatus:"待领取", assignedHr:"HR-虚构-01", permissions:["self:read"], officeArrangement:"到岗当日行政台领取工牌与设备" };
export const initialEmployees: Employee[] = [
  {...base,employeeId:"EMP-2026-0817",name:"陈晓雨",city:"上海",department:"数字化产品部",roleType:"内勤",onboardingDate:"2026-09-01",missingDocuments:["银行卡信息"],submittedDocuments:["身份证","学历证明","证件照"],accountStatus:{email:"已开通",oa:"开通中",vpn:"未申请"}},
  {...base,employeeId:"EMP-2026-0818",name:"李明",city:"北京",onboardingDate:"2026-09-02",documentReviewStatus:{身份证:"通过",学历证明:"审核失败"}},
  {...base,employeeId:"EMP-2026-0819",name:"周婷",city:"广州",onboardingDate:"2026-08-20",accountStatus:{email:"超时未开通",oa:"已开通",vpn:"未申请"}},
  {...base,employeeId:"EMP-2026-0820",name:"王浩",city:"深圳",onboardingDate:"2026-09-03",accountStatus:{email:"已开通",oa:"已开通",vpn:"申请失败"}},
  {...base,employeeId:"CNT-2026-0821",name:"赵敏",city:"上海",employeeType:"外包员工",onboardingDate:"2026-09-04",documentReviewStatus:{材料模板:"误匹配正式员工模板"}},
  {...base,employeeId:"EMP-2026-0822",name:"孙悦",city:"北京",onboardingDate:"2026-09-10",trainingStatus:"日程仍为原入职日 2026-09-01，未同步"},
  {...base,employeeId:"EMP-2026-0823",name:"张伟",city:"广州",onboardingDate:"2026-09-05"},
  {...base,employeeId:"EMP-2026-0824",name:"张伟",city:"深圳",onboardingDate:"2026-09-06"},
  {...base,employeeId:"EMP-2026-0825",name:"何静",city:"上海",onboardingDate:"2026-09-07",onboardingStage:"Offer 接受"},
  {...base,employeeId:"EMP-2026-0826",name:"刘洋",city:"北京",onboardingDate:"2026-08-28",onboardingStage:"到岗报到",accountStatus:{email:"已开通（需登录指引）",oa:"已开通",vpn:"已开通"}},
  {...base,employeeId:"EMP-2026-0827",name:"吴磊",city:"广州",onboardingDate:"2026-08-01",onboardingStage:"入职后 30 天",deviceStatus:"已领取"},
  {...base,employeeId:"EMP-2026-0828",name:"郑琪",city:"深圳",onboardingDate:"2026-09-08",permissions:[],deviceStatus:"领取信息权限不足"},
];

const doc=(id:string,title:string,category:string,cityScope:KnowledgeDocument["cityScope"],employeeTypeScope:KnowledgeDocument["employeeTypeScope"],content:string,keywords:string[]):KnowledgeDocument=>({id,title,category,cityScope,employeeTypeScope,effectiveDate:"2026-01-01",expiryDate:"2027-12-31",version:1,status:"active",content,keywords,sourceLabel:"星云保险集团虚构制度库",updatedAt:FIXTURE_TIMESTAMP});
export const initialKnowledgeDocuments: KnowledgeDocument[]=[
 doc("kb-shanghai","上海新员工入职指南","报到流程","上海","全部","上海新员工于入职日上午九点到星云中心虚构行政台报到。",["上海","报到","地点"]),
 doc("kb-beijing","北京新员工入职指南","报到流程","北京","全部","北京新员工于入职日上午九点到星云大厦虚构前台报到。",["北京","报到","地点"]),
 doc("kb-guangzhou","广州新员工入职指南","报到流程","广州","全部","广州新员工于入职日上午九点到星云广场虚构行政台报到。",["广州","报到","地点"]),
 doc("kb-shenzhen","深圳新员工入职指南","报到流程","深圳","全部","深圳新员工于入职日上午九点到星云园区虚构服务台报到。",["深圳","报到","地点"]),
 doc("kb-formal-docs","正式员工材料清单","入职材料","全国","正式员工","正式员工提交身份证复印件、学历证明、证件照及银行卡信息。",["正式员工","材料","银行卡","学历"]),
 doc("kb-contractor-docs","外包员工材料清单","入职材料","全国","外包员工","外包员工提交身份证明、外包服务确认函及证件照，不使用正式员工模板。",["外包员工","材料","模板"]),
 doc("kb-email","企业邮箱开通说明","账号系统","全国","全部","企业邮箱通常于到岗前一个工作日开通；超时请创建 IT 工单。",["邮箱","开通","登录","超时"]),
 doc("kb-oa","OA 账号开通说明","账号系统","全国","全部","OA 初次登录需通过企业邮箱完成身份验证。",["OA","账号","登录"]),
 doc("kb-vpn","VPN 使用手册","账号系统","全国","全部","VPN 仅用于授权业务访问；申请失败可创建 IT 工单。",["VPN","申请","失败"]),
 doc("kb-training","新员工培训安排","培训安排","全国","全部","培训日程以当前入职日期生成；日期变更后须由 HR 重新同步。",["培训","日程","入职日期"]),
 doc("kb-office","办公设备与工牌领取规则","办公行政","全国","全部","员工到岗并核验身份后，在所属城市行政台领取工牌与设备。",["设备","工牌","领取"]),
 doc("kb-faq","入职常见问题 FAQ","常见问题","全国","全部","无法确认身份、查无员工或复杂投诉时转人工处理。",["FAQ","人工","身份","查无此人"]),
];

const skillNames:Record<string,string>={"identity-resolution":"身份解析","intent-extraction":"意图提取","context-completion":"上下文补全","document-check":"材料核验","onboarding-guidance":"入职指引","account-troubleshooting":"账号排障","training-guidance":"培训指引","office-admin-guidance":"办公行政指引","knowledge-answering":"知识回答","clarification-question":"澄清提问","response-generator":"回复生成","privacy-risk-check":"隐私风险审核","human-handoff-decision":"人工转接判断","conversation-summary":"对话摘要"};
function hash(id:string){return `fixture-${id}-v1`}
export const initialSkills: Skill[]=Object.entries(skillNames).map(([id,name])=>({id,name,description:`${name}的确定性演示 Skill`,enabled:true,prompt:id==="privacy-risk-check"?"审计是否泄露他人信息或完整身份证、银行卡、手机号，是否编造状态、使用过期知识、越权承诺或应转人工；安全回复可发送，危险回复才阻断。":`执行${name}，仅依据已提供的 Tool 与知识证据。`,modelConfig:{provider:"fixture",temperature:0},requiredTools:[],inputSchema:'{"type":"object"}',outputSchema:'{"type":"object"}',version:1,createdAt:FIXTURE_TIMESTAMP,updatedAt:FIXTURE_TIMESTAMP,changeNote:"第 2 阶段初始化",hash:hash(id)}));

const tool=(id:string,name:string,permissions:string[],testInput:object):LocalTool=>({id,name,description:`从 IndexedDB ${name}`,enabled:true,inputSchema:'{"type":"object","required":["employeeId"]}',outputSchema:'{"type":"object"}',version:1,timeoutMs:1000,permissions,testInput:JSON.stringify(testInput)});
export const initialTools:LocalTool[]=[
 tool("get_employee_profile","读取员工档案",["self:read"],{employeeId:"EMP-2026-0817"}),tool("get_onboarding_checklist","读取入职清单",["self:read"],{employeeId:"EMP-2026-0817"}),tool("get_submitted_documents","读取已交材料",["self:read"],{employeeId:"EMP-2026-0817"}),tool("get_document_review_status","读取材料审核",["self:read"],{employeeId:"EMP-2026-0818"}),tool("get_account_status","读取账号状态",["self:read"],{employeeId:"EMP-2026-0819"}),tool("get_training_schedule","读取培训日程",["self:read"],{employeeId:"EMP-2026-0822"}),tool("get_office_arrangement","读取办公安排",["self:read"],{employeeId:"EMP-2026-0827"}),tool("search_knowledge","检索本地知识",["knowledge:read"],{query:"上海 报到",city:"上海"}),tool("create_hr_reminder","创建 HR 提醒",["hr:write"],{employeeId:"EMP-2026-0822",summary:"同步培训"}),tool("create_it_ticket","创建 IT 工单",["it:write"],{employeeId:"EMP-2026-0819",summary:"邮箱超时"}),tool("transfer_to_human","创建人工转接",["handoff:write"],{employeeId:"EMP-2026-0817",summary:"需要人工"})];
