import { AlertTriangle, CheckCircle2, LockKeyhole } from "lucide-react";
import { type ReactNode } from "react";
import { useToast } from "../components/feedback/ToastProvider";
import { useDatabase } from "../db/DatabaseProvider";
import { runtimeModes, smartModeConfigured } from "../lib/runtime-mode";

export function ModePage() {
  const { runtimeMode: mode, setRuntimeMode } = useDatabase();
  const { showToast } = useToast();
  async function save(next: "demo" | "smart") {
    if (next === "smart" && !smartModeConfigured) {
      showToast("未配置安全后端，无法启用智能模式");
      return;
    }
    await setRuntimeMode(next);
    showToast("运行模式已保存", "success");
  }
  return (
    <>
      <h1 className="page-title">运行模式</h1>
      <p className="page-description">
        本阶段只建立安全配置边界，不接入真实 LLM，也不接受浏览器 API Key。
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ModeCard
          title={runtimeModes.demo.label}
          description={runtimeModes.demo.description}
          active={mode === "demo"}
          icon={<CheckCircle2 />}
          onSelect={() => void save("demo")}
        />
        <ModeCard
          title={runtimeModes.smart.label}
          description={runtimeModes.smart.description}
          active={mode === "smart"}
          disabled={!smartModeConfigured}
          icon={smartModeConfigured ? <LockKeyhole /> : <AlertTriangle />}
          onSelect={() => void save("smart")}
        />
      </div>
      <section className="panel mt-6 border-amber-200 bg-amber-50">
        <div className="flex gap-3">
          <LockKeyhole className="shrink-0 text-amber-700" />
          <div>
            <h2 className="font-semibold">密钥安全约束</h2>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              GitHub Pages 前端不会保存或直接调用长期有效的 API
              Key。未来智能模式只通过 <code>VITE_AGENT_API_BASE_URL</code>{" "}
              指向的独立安全后端代理运行。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
function ModeCard({
  title,
  description,
  active,
  disabled = false,
  icon,
  onSelect,
}: {
  title: string;
  description: string;
  active: boolean;
  disabled?: boolean;
  icon: ReactNode;
  onSelect: () => void;
}) {
  return (
    <article
      className={`panel ${active ? "border-cyan-500 ring-1 ring-cyan-500" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span className={disabled ? "text-amber-700" : "text-cyan-700"}>
          {icon}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{title}</h2>
            {active && (
              <span className="status-badge border-emerald-200 bg-emerald-50 text-emerald-700">
                当前模式
              </span>
            )}
            {disabled && (
              <span className="status-badge border-amber-200 bg-amber-50 text-amber-800">
                不可用
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          <button
            className="button-secondary mt-5"
            disabled={active}
            onClick={onSelect}
          >
            {active ? "已选择" : "选择模式"}
          </button>
        </div>
      </div>
    </article>
  );
}
