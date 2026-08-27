import type {
  BusinessScenario,
  City,
  EmployeeType,
  KnowledgeDocument,
} from "../../types/persistence";
export interface SearchOptions {
  query: string;
  city?: City;
  employeeType?: EmployeeType;
  scenario?: BusinessScenario;
  topK?: number;
  now?: string;
}
export interface KnowledgeHit {
  document: KnowledgeDocument;
  score: number;
  reasons: string[];
}
export function searchKnowledgeDocuments(
  documents: KnowledgeDocument[],
  options: SearchOptions,
): KnowledgeHit[] {
  const now = options.now ?? new Date().toISOString().slice(0, 10),
    terms = options.query.toLowerCase().split(/\s+/).filter(Boolean);
  return documents
    .filter(
      (d) =>
        d.enabled &&
        d.status === "published" &&
        d.effectiveDate <= now &&
        d.expiryDate >= now,
    )
    .map((document) => {
      let score = 0;
      const reasons: string[] = [];
      const haystack =
        `${document.title} ${document.content} ${document.keywords.join(" ")}`.toLowerCase();
      const hits = terms.filter((term) => haystack.includes(term));
      if (hits.length) {
        score += hits.length * 10;
        reasons.push(`关键词：${hits.join("、")}`);
      }
      if (options.city && document.cityScope.includes(options.city)) {
        score += 8;
        reasons.push(`城市：${options.city}`);
      }
      if (
        options.employeeType &&
        document.employeeTypeScope.includes(options.employeeType)
      ) {
        score += 6;
        reasons.push(`员工类型：${options.employeeType}`);
      }
      if (options.scenario && document.category === options.scenario) {
        score += 7;
        reasons.push(`场景：${options.scenario}`);
      }
      return { document, score, reasons };
    })
    .filter((hit) => hit.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.document.id.localeCompare(b.document.id),
    )
    .slice(0, options.topK ?? 5);
}
