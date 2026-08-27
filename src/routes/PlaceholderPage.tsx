import { Construction } from "lucide-react";
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">
        该业务模块不属于第 1 阶段，将在对应阶段审核通过后实现。
      </p>
      <div className="panel mt-8 text-center">
        <Construction className="mx-auto text-amber-600" />
        <h2 className="mt-3 font-semibold">尚未实现</h2>
        <p className="mt-1 text-sm text-slate-500">
          当前仅保留导航入口用于验证布局与路由，不包含模拟业务功能。
        </p>
      </div>
    </>
  );
}
