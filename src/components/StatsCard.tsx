import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatsCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-300">{label}</div>
        {Icon ? (
          <div className="rounded-xl bg-slate-800 p-2 text-slate-300">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      {hint ? <div className="mt-1 text-sm text-slate-400">{hint}</div> : null}
    </div>
  );
}

