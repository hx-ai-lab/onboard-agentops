import { useEffect, useState } from "react";
import { db } from "../db/database";
import { executeLocalTool, type ToolResult } from "../features/tools/executor";
import type { ToolDefinition } from "../types/persistence";
export function ToolsPage() {
  const [tools, setTools] = useState<ToolDefinition[]>([]),
    [selected, setSelected] = useState<ToolDefinition>(),
    [input, setInput] = useState("{}"),
    [result, setResult] = useState<ToolResult>();
  async function load() {
    setTools(await db.tools.toArray());
  }
  useEffect(() => {
    void load();
  }, []);
  async function toggle(t: ToolDefinition) {
    await db.tools.put({
      ...t,
      enabled: !t.enabled,
      version: t.version + 1,
      updatedAt: new Date().toISOString(),
    });
    await load();
  }
  async function test() {
    if (!selected) return;
    try {
      setResult(
        await executeLocalTool(
          selected.id,
          JSON.parse(input) as Record<string, unknown>,
        ),
      );
    } catch (error) {
      setResult({
        status: "error",
        durationMs: 0,
        errorCode: "INVALID_INPUT",
        errorMessage: error instanceof Error ? error.message : "输入错误",
      });
    }
  }
  return (
    <>
      <h1 className="page-title">Tool 注册中心</h1>
      <p className="page-description">
        本地 Tool 真实读取或写入
        IndexedDB，可区分空结果、权限不足、超时和结构错误。
      </p>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="panel">
          <ul className="divide-y">
            {tools.map((t) => (
              <li key={t.id} className="flex items-center gap-2 py-3">
                <button
                  className="flex-1 text-left"
                  onClick={() => {
                    setSelected(t);
                    setInput(JSON.stringify(t.testInput, null, 2));
                    setResult(undefined);
                  }}
                >
                  <b>{t.id}</b>
                  <small className="block">
                    {t.timeoutMs}ms · {t.permissions.join(", ")}
                  </small>
                </button>
                <button
                  className="button-secondary"
                  onClick={() => void toggle(t)}
                >
                  {t.enabled ? "停用" : "启用"}
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          {selected ? (
            <>
              <h2 className="font-semibold">测试 {selected.id}</h2>
              <pre className="mt-3 overflow-auto rounded bg-slate-50 p-3 text-xs">
                输入 Schema：{JSON.stringify(selected.inputSchema, null, 2)}
                {"\n"}输出 Schema：
                {JSON.stringify(selected.outputSchema, null, 2)}
              </pre>
              <textarea
                className="field mt-3 min-h-36 font-mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="button-primary mt-3"
                onClick={() => void test()}
              >
                运行单项测试
              </button>
              {result && (
                <pre className="mt-3 overflow-auto rounded bg-slate-950 p-3 text-xs text-white">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </>
          ) : (
            <p>请选择 Tool。</p>
          )}
        </section>
      </div>
    </>
  );
}
