import { useCallback, useEffect, useState } from "react";
import { db } from "../db/database";
import {
  diffSkill,
  rollbackSkill,
  saveSkill,
} from "../features/skills/service";
import type { SkillDefinition, SkillVersion } from "../types/persistence";
import { useToast } from "../components/feedback/ToastProvider";
export function SkillsPage() {
  const [items, setItems] = useState<SkillDefinition[]>([]),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<SkillDefinition>(),
    [versions, setVersions] = useState<SkillVersion[]>([]);
  const { showToast } = useToast();
  const load = useCallback(async () => setItems(await db.skills.toArray()), []);
  useEffect(() => {
    void load();
  }, [load]);
  async function select(skill: SkillDefinition) {
    setSelected(structuredClone(skill));
    setVersions(
      await db.skillVersions
        .where("skillId")
        .equals(skill.id)
        .reverse()
        .sortBy("snapshotAt"),
    );
  }
  async function save() {
    if (!selected) return;
    await saveSkill(selected);
    showToast("已保存并创建版本快照", "success");
    await load();
    await select((await db.skills.get(selected.id))!);
  }
  async function toggle(skill: SkillDefinition) {
    await saveSkill({
      ...skill,
      enabled: !skill.enabled,
      changeNote: skill.enabled ? "停用" : "启用",
    });
    await load();
  }
  return (
    <>
      <h1 className="page-title">Skill 注册中心</h1>
      <p className="page-description">
        配置真实持久化到 IndexedDB；单项测试仅校验 Fixture
        输入与配置，不运行完整 Agent。
      </p>
      <input
        className="field mt-6 max-w-md"
        placeholder="筛选 Skill"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <section className="panel">
          <ul className="divide-y">
            {items
              .filter((x) => x.id.includes(query))
              .map((x) => (
                <li key={x.id} className="flex items-center gap-3 py-3">
                  <button
                    className="min-w-0 flex-1 text-left"
                    onClick={() => void select(x)}
                  >
                    <b className="block truncate">{x.id}</b>
                    <small>
                      v{x.version} · {x.hash}
                    </small>
                  </button>
                  <button
                    className="button-secondary"
                    onClick={() => void toggle(x)}
                  >
                    {x.enabled ? "停用" : "启用"}
                  </button>
                </li>
              ))}
          </ul>
        </section>
        <section className="panel">
          {selected ? (
            <>
              <h2 className="font-semibold">编辑 {selected.id}</h2>
              <textarea
                className="field mt-4 min-h-40"
                value={selected.prompt}
                onChange={(e) =>
                  setSelected({ ...selected, prompt: e.target.value })
                }
              />
              <input
                className="field mt-3"
                value={selected.changeNote}
                onChange={(e) =>
                  setSelected({ ...selected, changeNote: e.target.value })
                }
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="button-primary" onClick={() => void save()}>
                  保存版本
                </button>
                <button
                  className="button-secondary"
                  onClick={() =>
                    showToast(
                      selected.inputSchema && selected.outputSchema
                        ? "Schema 与 Fixture 配置有效"
                        : "配置无效",
                      selected.inputSchema ? "success" : "info",
                    )
                  }
                >
                  单项测试
                </button>
              </div>
              <h3 className="mt-6 font-semibold">版本快照</h3>
              {versions.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  修改前将自动创建快照。
                </p>
              ) : (
                versions.map((v) => (
                  <div
                    className="mt-2 rounded-lg border p-3 text-sm"
                    key={v.snapshotId}
                  >
                    <div>
                      v{v.version} · {v.changeNote}
                    </div>
                    <pre className="mt-2 overflow-auto text-xs">
                      {JSON.stringify(diffSkill(v, selected), null, 2)}
                    </pre>
                    <button
                      className="button-secondary mt-2"
                      onClick={async () => {
                        await rollbackSkill(selected.id, v.snapshotId);
                        await load();
                        await select((await db.skills.get(selected.id))!);
                        showToast("已回滚", "success");
                      }}
                    >
                      回滚
                    </button>
                  </div>
                ))
              )}
            </>
          ) : (
            <p>请选择 Skill。</p>
          )}
        </section>
      </div>
    </>
  );
}
