import { Inbox } from "lucide-react";
export function EmptyState({
  title = "暂无数据",
  description = "当前没有可显示的内容。",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-slate-50 p-10 text-center">
      <Inbox className="mx-auto text-slate-400" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
