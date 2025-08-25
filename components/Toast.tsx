import { ReactNode } from "react";

interface ToastProps {
  type: "success" | "error";
  message: ReactNode;
}

export default function Toast({ type, message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 rounded-2xl p-4 shadow-lg shadow-black/5 border ${
        type === "success"
          ? "border-emerald-600 text-emerald-600 bg-white dark:bg-slate-900"
          : "border-rose-600 text-rose-600 bg-white dark:bg-slate-900"
      }`}
    >
      {message}
    </div>
  );
}
