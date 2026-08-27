import { Download, Plus, RotateCcw, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyState } from "../components/feedback/EmptyState";
import { LoadingState } from "../components/feedback/LoadingState";
import { useToast } from "../components/feedback/ToastProvider";
import { useDatabase } from "../db/DatabaseProvider";
import { exportDatabase, importDatabase } from "../db/backup";
import { db } from "../db/database";
import { resetDatabase } from "../db/seed";
import type { DemoBackup, DemoRecord } from "../types/persistence";

export function DataPage() {
  const [records, setRecords] = useState<DemoRecord[] | null>(null);
  const [title, setTitle] = useState("");
  const [confirming, setConfirming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { refreshRuntimeMode } = useDatabase();
  const load = useCallback(
    async () =>
      setRecords(await db.demoRecords.orderBy("updatedAt").reverse().toArray()),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  async function addRecord() {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    await db.demoRecords.add({
      id: crypto.randomUUID(),
      title: title.trim(),
      note: "用户创建的持久化验证记录。",
      createdAt: now,
      updatedAt: now,
    });
    setTitle("");
    await load();
    showToast("记录已写入 IndexedDB", "success");
  }
  async function reset() {
    await resetDatabase(db);
    await refreshRuntimeMode();
    setConfirming(false);
    await load();
    showToast("演示数据已恢复为初始状态", "success");
  }
  async function download() {
    const data = await exportDatabase(db);
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "onboardops-demo-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("演示数据已导出", "success");
  }
  async function upload(file?: File) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as DemoBackup;
      await importDatabase(db, data);
      await load();
      showToast("演示数据已导入", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "导入失败");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }
  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">数据管理</h1>
          <p className="page-description">
            第 1 阶段的最小 IndexedDB 验证界面。记录在页面刷新后仍会保留。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="button-secondary" onClick={download}>
            <Download size={17} />
            导出数据
          </button>
          <button
            className="button-secondary"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={17} />
            导入数据
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <button
            className="button-secondary text-red-700"
            onClick={() => setConfirming(true)}
          >
            <RotateCcw size={17} />
            重置数据
          </button>
        </div>
      </header>
      <section className="panel mt-8">
        <h2 className="font-semibold">添加持久化验证记录</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="record-title">
            记录标题
          </label>
          <input
            id="record-title"
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：刷新后仍然存在"
            onKeyDown={(e) => {
              if (e.key === "Enter") void addRecord();
            }}
          />
          <button
            className="button-primary shrink-0"
            disabled={!title.trim()}
            onClick={() => void addRecord()}
          >
            <Plus size={17} />
            保存记录
          </button>
        </div>
      </section>
      <section className="panel mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">本地记录</h2>
          <span className="status-badge border-slate-200 bg-slate-50 text-slate-600">
            {records?.length ?? "—"} 条
          </span>
        </div>
        {records === null ? (
          <LoadingState />
        ) : records.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y">
            {records.map((record) => (
              <li
                className="py-4 first:pt-0 last:pb-0"
                key={record.id}
                data-testid="demo-record"
              >
                <div className="font-medium">{record.title}</div>
                <p className="mt-1 text-sm text-slate-500">{record.note}</p>
                <code className="mt-2 block break-all text-xs text-slate-400">
                  {record.id}
                </code>
              </li>
            ))}
          </ul>
        )}
      </section>
      {confirming && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <div className="panel w-full max-w-md">
            <h2 id="reset-title" className="text-lg font-bold">
              确认重置演示数据？
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              所有当前本地记录会被删除，并恢复为确定性的初始
              Fixture。此操作可以安全地重复执行。
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="button-secondary"
                onClick={() => setConfirming(false)}
              >
                取消
              </button>
              <button className="button-danger" onClick={() => void reset()}>
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
