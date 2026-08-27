import {
  ArrowRight,
  CheckCircle2,
  Database,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { appBasePath } from "../lib/github-pages";
const capabilities = [
  {
    icon: Database,
    title: "本地持久化已就绪",
    text: "Dexie + IndexedDB 提供版本化 Schema、初始化、备份与幂等重置。",
  },
  {
    icon: GitBranch,
    title: "Pages 路由兼容",
    text: `HashRouter 已启用，当前静态资源 base 为 ${appBasePath}`,
  },
  {
    icon: ShieldCheck,
    title: "安全模式边界",
    text: "演示模式无需密钥；智能模式仅允许连接未来的安全后端代理。",
  },
];
export function HomePage() {
  return (
    <>
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="page-title">平台概览</h1>
          <span className="status-badge border-emerald-200 bg-emerald-50 text-emerald-800">
            <CheckCircle2 size={14} />第 1 阶段基础能力
          </span>
        </div>
        <p className="page-description">
          工程骨架与数据底座已建立。Agent、Planner、Skill、Tool、知识、Eval
          与报告业务将在审核后按阶段增量实现。
        </p>
      </header>
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {capabilities.map(({ icon: Icon, title, text }) => (
          <article className="panel" key={title}>
            <Icon className="text-cyan-700" />
            <h2 className="mt-5 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </article>
        ))}
      </section>
      <section className="panel mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">验证本地数据层</h2>
          <p className="mt-1 text-sm text-slate-600">
            创建一条测试记录、刷新页面，再执行重复重置。
          </p>
        </div>
        <Link className="button-primary shrink-0" to="/data">
          打开数据管理
          <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
