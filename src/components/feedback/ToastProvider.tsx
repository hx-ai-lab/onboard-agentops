import { CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
type ToastKind = "success" | "info";
interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}
const ToastContext = createContext<{
  showToast: (message: string, kind?: ToastKind) => void;
} | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, kind }]);
    window.setTimeout(
      () => setToasts((items) => items.filter((item) => item.id !== id)),
      3500,
    );
  }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg"
          >
            {toast.kind === "success" ? (
              <CheckCircle2 className="text-emerald-600" />
            ) : (
              <Info className="text-cyan-700" />
            )}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              aria-label="关闭通知"
              onClick={() =>
                setToasts((items) =>
                  items.filter((item) => item.id !== toast.id),
                )
              }
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}
