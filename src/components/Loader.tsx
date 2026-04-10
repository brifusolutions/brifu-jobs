"use client";

import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary",
        className,
      )}
      aria-label="Loading"
      role="status"
    />
  );
}

