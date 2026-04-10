"use client";

import { cn } from "@/lib/utils";

export function SmallProgressBar({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-slate-800", className)}>
      <div className="h-1.5 rounded-full bg-primary transition-[width] duration-300" style={{ width: `${v}%` }} />
    </div>
  );
}

