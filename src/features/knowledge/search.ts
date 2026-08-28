import type { KnowledgeDocument } from "../../types/persistence";
export interface KnowledgeQuery { query:string; city?:string; employeeType?:string; category?:string; now?:string; topK?:number }
export interface KnowledgeHit { document:KnowledgeDocument; score:number; matchedKeywords:string[]; snippet:string }
export function searchKnowledge(documents:KnowledgeDocument[],input:KnowledgeQuery):KnowledgeHit[]{
  const terms=input.query.toLowerCase().split(/\s+/).filter(Boolean); const now=input.now??new Date().toISOString().slice(0,10);
  return documents.filter(d=>d.status==="active"&&d.effectiveDate<=now&&d.expiryDate>=now).map(document=>{
    const hay=`${document.title} ${document.content} ${document.keywords.join(" ")}`.toLowerCase();
    const matchedKeywords=[...new Set([...terms,...document.keywords.filter(k=>input.query.toLowerCase().includes(k.toLowerCase()))])].filter(t=>hay.includes(t));
    let score=matchedKeywords.length*10;
    if(input.city&&(document.cityScope===input.city||document.cityScope==="全国")) score+=document.cityScope===input.city?8:2;
    if(input.employeeType&&(document.employeeTypeScope===input.employeeType||document.employeeTypeScope==="全部")) score+=document.employeeTypeScope===input.employeeType?6:1;
    if(input.category===document.category) score+=5;
    return {document,score,matchedKeywords,snippet:document.content.slice(0,160)};
  }).filter(h=>h.score>0).sort((a,b)=>b.score-a.score||a.document.id.localeCompare(b.document.id)).slice(0,input.topK??3);
}
