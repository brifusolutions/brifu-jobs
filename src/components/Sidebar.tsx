"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileUp, ListChecks, LineChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/upload", label: "Upload Resumes", icon: FileUp },
  { href: "/results", label: "Parsed Results", icon: ListChecks },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-[#0B1220] md:block">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
        <div className="h-9 w-9 rounded-2xl bg-primary shadow-soft" />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">Admin Panel</div>
          <div className="text-xs text-slate-400">Resume Analyzer SaaS</div>
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Menu
        </div>
        <nav className="mt-3 space-y-1">
          {navItems.map((i) => {
            const active = pathname === i.href;
            const Icon = i.icon;
            return (
              <Link
                key={i.href}
                href={i.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-200",
                  active
                    ? "bg-primary text-white shadow-soft"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-400")} />
                {i.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

