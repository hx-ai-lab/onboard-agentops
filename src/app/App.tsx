import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "../components/feedback/ErrorBoundary";
import { ToastProvider } from "../components/feedback/ToastProvider";
import { DatabaseProvider } from "../db/DatabaseProvider";
import { AppRouter } from "./router";

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DatabaseProvider>
          <HashRouter>
            <AppRouter />
          </HashRouter>
        </DatabaseProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
