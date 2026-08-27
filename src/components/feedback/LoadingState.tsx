export function LoadingState({ label = "正在加载…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 p-10 text-sm text-slate-600"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600" />
      {label}
    </div>
  );
}
