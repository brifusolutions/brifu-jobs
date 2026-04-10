"use client";

import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const titleByPath: Record<string, string> = {
  "/dashboard": "Admin Dashboard",
  "/upload": "Upload Resumes",
  "/results": "Parsed Results",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function Navbar() {
  const pathname = usePathname();
  const title = useMemo(() => titleByPath[pathname] || "Admin Panel", [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#0B1220]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="flex items-center gap-2">
          <div className="hidden text-sm text-slate-300 sm:block">Signed in as Admin</div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <button type="button" className="btn-secondary rounded-xl px-3 py-1.5 text-xs">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

