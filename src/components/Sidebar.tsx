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
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-[220px] flex-col justify-between border-r border-[#1f3146] bg-[#0d1b2a]">
      <div>
        <div className="px-4 pt-5">
          <div className="text-[34px] leading-none text-[#f4f8ff]" style={{ fontFamily: "var(--font-cormorant)" }}>
            ResumeIQ
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#b8c8da]">Admin Panel</div>
        </div>

        <div className="px-4 pt-8 text-[10px] uppercase tracking-[0.1em] text-[#b8c8da]">Menu</div>
        <nav className="mt-3 space-y-1">
          {navItems.map((i) => {
            const active = pathname === i.href;
            const Icon = i.icon;
            return (
              <Link
                key={i.href}
                href={i.href}
                className={cn(
                  "mx-0.5 flex items-center gap-2 border-l-2 px-4 py-2.5 text-[13px] transition",
                  active
                    ? "border-l-[#8aafd4] bg-[#13273d] text-[#eef4fb]"
                    : "border-l-transparent text-[#d3e0ed] hover:bg-[#13273d] hover:text-[#eef4fb]",
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", active ? "text-[#dce8f5]" : "text-[#b8c8da]")} />
                {i.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 border-t border-[#1f3146] px-3 py-3">
        <div className="grid h-5 w-5 place-items-center rounded-full border border-[#9db4cc] text-[10px] text-[#e5eff9]">
          AD
        </div>
        <div className="text-[11px] text-[#d3e0ed]">Administrator</div>
      </div>
    </aside>
  );
}

