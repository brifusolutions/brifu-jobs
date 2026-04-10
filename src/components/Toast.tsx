"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastCtx = {
  toast: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const item: ToastItem = { id, ...t };
    setItems((prev) => [item, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "card w-[320px] overflow-hidden p-4 transition",
              t.type === "success" && "border-emerald-200 bg-emerald-50",
              t.type === "error" && "border-rose-200 bg-rose-50",
              t.type === "info" && "border-slate-200 bg-white",
            )}
          >
            <div className="text-sm font-semibold text-slate-900">{t.title}</div>
            {t.description ? (
              <div className="mt-1 text-sm text-slate-600">{t.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

