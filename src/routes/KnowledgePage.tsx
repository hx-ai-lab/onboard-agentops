import { useEffect, useState } from "react";
import { db } from "../db/database";
import {
  searchKnowledgeDocuments,
  type KnowledgeHit,
} from "../features/knowledge/search";
import type {
  City,
  EmployeeType,
  KnowledgeDocument,
} from "../types/persistence";
export function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]),
    [query, setQuery] = useState("上海 报到"),
    [city, setCity] = useState<City>("上海"),
    [employeeType, setType] = useState<EmployeeType>("正式员工"),
    [hits, setHits] = useState<KnowledgeHit[]>([]),
    [selected, setSelected] = useState<KnowledgeDocument>();
  async function load() {
    setDocs(await db.knowledgeDocuments.toArray());
  }
  useEffect(() => {
    void load();
  }, []);
  async function toggle(d: KnowledgeDocument) {
    await db.knowledgeDocuments.put({
      ...d,
      enabled: !d.enabled,
      updatedAt: new Date().toISOString(),
    });
    await load();
  }
  return (
    <>
      <h1 className="page-title">知识库</h1>
      <p className="page-description">
        本地规则检索演示，不是向量数据库或真实
        RAG。按关键词、城市、员工类型、场景、有效期和启用状态确定性加权。
      </p>
      <section className="panel mt-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            className="field sm:col-span-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="field"
            value={city}
            onChange={(e) => setCity(e.target.value as City)}
          >
            {["上海", "北京", "广州", "深圳"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            className="field"
            value={employeeType}
            onChange={(e) => setType(e.target.value as EmployeeType)}
          >
            <option>正式员工</option>
            <option>外包员工</option>
          </select>
        </div>
        <button
          className="button-primary mt-3"
          onClick={() =>
            setHits(
              searchKnowledgeDocuments(docs, {
                query,
                city,
                employeeType,
                topK: 5,
              }),
            )
          }
        >
          测试本地检索
        </button>
        {hits.map((h) => (
          <div className="mt-3 rounded border p-3" key={h.document.id}>
            <b>{h.document.title}</b>{" "}
            <span className="status-badge">score {h.score}</span>
            <p className="text-sm">{h.reasons.join("；")}</p>
          </div>
        ))}
      </section>
      <section className="panel mt-5">
        <ul className="divide-y">
          {docs.map((d) => (
            <li className="flex items-start gap-3 py-3" key={d.id}>
              <div className="flex-1">
                <button
                  className="font-semibold text-left"
                  onClick={() => setSelected(structuredClone(d))}
                >
                  {d.title}
                </button>
                <p className="text-sm text-slate-600">
                  {d.category} · {d.cityScope.join("/")} ·{" "}
                  {d.employeeTypeScope.join("/")} · {d.effectiveDate}—
                  {d.expiryDate}
                </p>
              </div>
              <button
                className="button-secondary"
                onClick={() => void toggle(d)}
              >
                {d.enabled ? "停用" : "启用"}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {selected && (
        <section className="panel mt-5">
          <h2 className="font-semibold">编辑 {selected.title}</h2>
          <textarea
            className="field mt-3 min-h-32"
            value={selected.content}
            onChange={(event) =>
              setSelected({ ...selected, content: event.target.value })
            }
          />
          <button
            className="button-primary mt-3"
            onClick={async () => {
              const parts = selected.version.split(".");
              const next = {
                ...selected,
                version: `${parts[0]}.${Number(parts[1] ?? 0) + 1}.0`,
                updatedAt: new Date().toISOString(),
              };
              await db.knowledgeDocuments.put(next);
              setSelected(next);
              await load();
            }}
          >
            保存新版本
          </button>
        </section>
      )}
    </>
  );
}
