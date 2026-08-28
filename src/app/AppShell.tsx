import {
  Database,
  FlaskConical,
  Home,
  Menu,
  MoonStar,
  PlaySquare,
  Settings2,
  Wrench,
  BookOpen,
  Users,
  Sparkles,
  Bot, Route as RouteIcon, ChartNoAxesCombined,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDatabase } from "../db/DatabaseProvider";

const links = [
  { to: "/", label: "概览", icon: Home, end: true },
  { to: "/workspace", label: "工作台", icon: PlaySquare },
  { to: "/runs", label: "运行记录", icon: MoonStar },
  { to: "/agents", label: "Agent 管理", icon: Bot },
  { to: "/planner", label: "Planner 管理", icon: RouteIcon },
  { to: "/models", label: "模型与 Provider", icon: Settings2 },
  { to: "/ops", label: "运营中心", icon: ChartNoAxesCombined },
  { to: "/eval", label: "Eval 测评", icon: FlaskConical },
  { to: "/skills", label: "Skill 注册中心", icon: Sparkles },
  { to: "/tools", label: "Tool 注册中心", icon: Wrench },
  { to: "/knowledge", label: "知识库", icon: BookOpen },
  { to: "/catalog", label: "业务数据目录", icon: Users },
  { to: "/data", label: "数据管理", icon: Database },
  { to: "/mode", label: "运行模式", icon: Settings2 },
];

export function AppShell() {
  const [open, setOpen] = useState(false);
  const { status, runtimeMode } = useDatabase();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          className="icon-button"
          aria-label="打开导航"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
        <span className="ml-3 font-semibold">OnboardOps</span>
        <ModeBadge mode={runtimeMode} className="ml-auto" />
      </header>
      {open && (
        <button
          aria-label="关闭导航遮罩"
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-slate-950 text-slate-200 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-5">
          <div className="grid size-9 place-items-center rounded-lg bg-cyan-400 font-bold text-slate-950">
            O
          </div>
          <div>
            <div className="font-semibold text-white">OnboardOps</div>
            <div className="text-xs text-slate-400">AgentOps 测评运营平台</div>
          </div>
          <button
            className="ml-auto lg:hidden"
            aria-label="关闭导航"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="主导航">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <ModeBadge mode={runtimeMode} />
          <p className="mt-2 text-xs text-slate-400">
            数据层：
            {status === "ready"
              ? "已就绪"
              : status === "error"
                ? "异常"
                : "初始化中"}
          </p>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white px-5 py-4 text-center text-xs leading-5 text-slate-500 lg:ml-64">
        本平台用于产品设计与 AI
        测评演示。全部企业、员工、制度和运行指标均为虚构数据，不代表任何真实公司生产信息。
      </footer>
    </div>
  );
}

function ModeBadge({
  mode,
  className = "",
}: {
  mode: "demo" | "smart";
  className?: string;
}) {
  return (
    <span
      className={`status-badge border-cyan-300 bg-cyan-50 text-cyan-800 ${className}`}
    >
      <span className="size-1.5 rounded-full bg-cyan-600" />
      {mode === "demo" ? "演示稳定模式" : "智能模式"}
    </span>
  );
}
