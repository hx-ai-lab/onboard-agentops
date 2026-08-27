import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { db } from "./database";
import { initializeDatabase } from "./seed";
import type { RuntimeMode } from "../types/persistence";

type DatabaseStatus = "initializing" | "ready" | "error";
interface DatabaseContextValue {
  status: DatabaseStatus;
  error?: string;
  retry: () => void;
  runtimeMode: RuntimeMode;
  setRuntimeMode: (mode: RuntimeMode) => Promise<void>;
  refreshRuntimeMode: () => Promise<void>;
}
const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<DatabaseStatus>("initializing");
  const [error, setError] = useState<string>();
  const [runtimeMode, setRuntimeModeState] = useState<RuntimeMode>("demo");
  useEffect(() => {
    let active = true;
    setStatus("initializing");
    setError(undefined);
    initializeDatabase(db)
      .then(async () => {
        const setting = await db.settings.get("runtimeMode");
        if (active) {
          setRuntimeModeState(
            (setting?.value as RuntimeMode | undefined) ?? "demo",
          );
          setStatus("ready");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : "IndexedDB 初始化失败",
          );
          setStatus("error");
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  const value = useMemo(() => {
    const setRuntimeMode = async (mode: RuntimeMode) => {
      await db.settings.put({
        key: "runtimeMode",
        value: mode,
        updatedAt: new Date().toISOString(),
      });
      setRuntimeModeState(mode);
    };
    const refreshRuntimeMode = async () => {
      const setting = await db.settings.get("runtimeMode");
      setRuntimeModeState(
        (setting?.value as RuntimeMode | undefined) ?? "demo",
      );
    };
    return {
      status,
      error,
      runtimeMode,
      setRuntimeMode,
      refreshRuntimeMode,
      retry: () => setAttempt((value) => value + 1),
    };
  }, [status, error, runtimeMode]);
  if (status === "initializing")
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div role="status" className="text-center">
          <span className="mx-auto block size-8 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />
          <p className="mt-4 text-sm font-medium">正在初始化本地数据…</p>
        </div>
      </div>
    );
  if (status === "error")
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="panel max-w-md text-center">
          <h1 className="text-xl font-bold">数据初始化失败</h1>
          <p className="my-3 text-sm text-red-700">{error}</p>
          <button
            className="button-primary"
            onClick={() => setAttempt((value) => value + 1)}
          >
            重试初始化
          </button>
        </div>
      </div>
    );
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
export function useDatabase() {
  const value = useContext(DatabaseContext);
  if (!value)
    throw new Error("useDatabase must be used inside DatabaseProvider");
  return value;
}
