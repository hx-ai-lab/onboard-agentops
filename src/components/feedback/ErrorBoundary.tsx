import { Component, type ErrorInfo, type ReactNode } from "react";
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled application error", error, info.componentStack);
  }
  render() {
    if (this.state.failed)
      return (
        <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
          <section className="panel max-w-lg text-center">
            <p className="status-badge border-red-200 bg-red-50 text-red-700">
              错误
            </p>
            <h1 className="mt-4 text-2xl font-bold">页面暂时无法显示</h1>
            <p className="mt-2 text-sm text-slate-600">
              应用遇到了未处理错误。请刷新页面后重试。
            </p>
            <button
              className="button-primary mt-5"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </section>
        </main>
      );
    return this.props.children;
  }
}
