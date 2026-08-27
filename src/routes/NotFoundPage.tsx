import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <div className="panel mx-auto max-w-xl text-center">
      <p className="text-sm font-bold text-cyan-700">404</p>
      <h1 className="mt-2 text-2xl font-bold">页面不存在</h1>
      <p className="mt-2 text-sm text-slate-600">
        Hash 路由已正常工作，但没有找到对应页面。
      </p>
      <Link to="/" className="button-primary mt-5">
        返回概览
      </Link>
    </div>
  );
}
