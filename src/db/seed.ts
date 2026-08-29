import { FIXTURE_TIMESTAMP, initialDemoRecords, initialEmployees, initialEvalCases, initialKnowledgeDocuments, initialMeta, initialSettings, initialSkills, initialTools } from "../data/fixtures";
import type { OnboardOpsDatabase } from "./database";
export async function initializeDatabase(database:OnboardOpsDatabase):Promise<"seeded"|"existing"> {
  await database.open();
  const initialized=await database.meta.get("initialized");
  if (!initialized) { await resetDatabase(database); return "seeded"; }
  // Existing v1 databases are enriched without clearing or overwriting any row.
  if ((await database.employees.count())===0) await database.employees.bulkAdd(structuredClone(initialEmployees));
  if ((await database.knowledgeDocuments.count())===0) await database.knowledgeDocuments.bulkAdd(structuredClone(initialKnowledgeDocuments));
  if ((await database.skills.count())===0) await database.skills.bulkAdd(structuredClone(initialSkills));
  if ((await database.tools.count())===0) await database.tools.bulkAdd(structuredClone(initialTools));
  await seedPhase4(database);
  if((await database.evalCases.count())===0) await database.evalCases.bulkAdd(structuredClone(initialEvalCases));
  await database.meta.put({key:"schemaVersion",value:"7",updatedAt:FIXTURE_TIMESTAMP});
  await database.meta.put({key:"fixtureVersion",value:"phase-7-v7",updatedAt:FIXTURE_TIMESTAMP});
  return "existing";
}
export async function resetDatabase(database:OnboardOpsDatabase):Promise<void> {
  await database.transaction("rw",database.tables,async()=>{
    await Promise.all(database.tables.map(table=>table.clear()));
    await database.settings.bulkAdd(structuredClone(initialSettings)); await database.demoRecords.bulkAdd(structuredClone(initialDemoRecords));
    await database.meta.bulkAdd([...structuredClone(initialMeta),{key:"initialized",value:"true",updatedAt:FIXTURE_TIMESTAMP}]);
    await database.employees.bulkAdd(structuredClone(initialEmployees)); await database.knowledgeDocuments.bulkAdd(structuredClone(initialKnowledgeDocuments));
    await database.skills.bulkAdd(structuredClone(initialSkills)); await database.tools.bulkAdd(structuredClone(initialTools));
    await seedPhase4(database);
    await database.evalCases.bulkAdd(structuredClone(initialEvalCases));
  });
}
async function seedPhase4(database:OnboardOpsDatabase){
 const now=FIXTURE_TIMESTAMP;
 if(await database.agents.count()===0) await database.agents.add({id:"onboarding-agent",name:"企业入职助手",audience:"一线销售人员与新员工",systemPrompt:"基于已核验的 Tool 与知识证据回答；保护隐私，必要时转人工。",businessBoundary:"仅处理入职材料、报到、账号、培训与办公行政，不承诺未核验状态。",knowledgeIds:initialKnowledgeDocuments.map(x=>x.id),skillIds:initialSkills.map(x=>x.id),toolIds:initialTools.map(x=>x.id),version:1,enabled:true,updatedAt:now});
 if(await database.plannerConfigs.count()===0) await database.plannerConfigs.add({id:"default-planner",prompt:"识别意图，先确认身份，再选择最小且充分的能力；最终必须执行隐私风险检查。",version:1,mandatoryCapabilities:["privacy-risk-check"],allowedSkills:initialSkills.map(x=>x.id),allowedTools:initialTools.map(x=>x.id),updatedAt:now});
}
