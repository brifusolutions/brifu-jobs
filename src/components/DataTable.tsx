"use client";

import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeRow } from "@/lib/types";

type SortKey = "name" | "email" | "phone" | "experience";
type SortDir = "asc" | "desc";

function norm(v: string | null | undefined) {
  return (v || "").toLowerCase().trim();
}

export function DataTable({
  rows,
  loading,
  pageSize = 10,
  onDeleteRow,
  showSkills = true,
  showExperience = true,
}: {
  rows: ResumeRow[];
  loading?: boolean;
  pageSize?: number;
  onDeleteRow?: (row: ResumeRow) => void;
  showSkills?: boolean;
  showExperience?: boolean;
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((r) => {
      const skillsText = (r.skills || []).join(" ");
      const hay = `${r.name || ""} ${r.email || ""} ${r.phone || ""} ${skillsText} ${r.experience || ""} ${r.filename || ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, rows]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = norm(a[sortKey]);
      const bv = norm(b[sortKey]);
      const res = av.localeCompare(bv);
      return sortDir === "asc" ? res : -res;
    });
    return copy;
  }, [filtered, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [pageSize, safePage, sorted]);

  function toggleSort(k: SortKey) {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  }

  const headerBtn = (k: SortKey, label: string) => {
    const active = sortKey === k;
    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-white",
          active && "text-white",
        )}
        onClick={() => toggleSort(k)}
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : null}
      </button>
    );
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-800 bg-[#111827] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Parsed Candidates</div>
          <div className="text-sm text-slate-400">
            {loading ? "Processing…" : `${sorted.length} result${sorted.length === 1 ? "" : "s"}`}
          </div>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, skills, email, phone…"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-100 outline-none ring-primary/30 placeholder:text-slate-500 focus:ring-4"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-900/70">
            <tr>
              <th className="px-4 py-3">{headerBtn("name", "Name")}</th>
              <th className="px-4 py-3">{headerBtn("email", "Email")}</th>
              <th className="px-4 py-3">{headerBtn("phone", "Phone")}</th>
              {showSkills ? (
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</th>
              ) : null}
              {showExperience ? <th className="px-4 py-3">{headerBtn("experience", "Experience")}</th> : null}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-[#111827]">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-56 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                  </td>
                  {showSkills ? (
                    <td className="px-4 py-4">
                      <div className="h-4 w-48 animate-pulse rounded bg-slate-800" />
                    </td>
                  ) : null}
                  {showExperience ? (
                    <td className="px-4 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
                    </td>
                  ) : null}
                  <td className="px-4 py-4 text-right">
                    <div className="ml-auto h-8 w-16 animate-pulse rounded-xl bg-slate-800" />
                  </td>
                </tr>
              ))
            ) : paged.length ? (
              paged.map((r, idx) => (
                <tr
                  key={`${r.email || r.phone || r.filename || idx}`}
                  className="transition hover:bg-slate-900/60"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-slate-100">
                    {r.name || "—"}
                    {r.error ? (
                      <div className="mt-1 text-xs font-medium text-rose-400">
                        {r.error}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">{r.email || "—"}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">{r.phone || "—"}</td>
                  {showSkills ? (
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {r.skills?.length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {r.skills.map((skill) => (
                            <span
                              key={`${r.slug || r.email || r.phone || "candidate"}-${skill}`}
                              className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-xs text-sky-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  ) : null}
                  {showExperience ? <td className="px-4 py-4 text-sm text-slate-300">{r.experience || "—"}</td> : null}
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                      onClick={() => onDeleteRow?.(r)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-10 text-sm text-slate-400"
                  colSpan={4 + (showSkills ? 1 : 0) + (showExperience ? 1 : 0)}
                >
                  No results yet. Upload PDFs to see parsed candidates here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-800 bg-[#111827] p-4">
        <div className="text-sm text-slate-400">
          Page <span className="font-semibold text-slate-100">{safePage}</span> of{" "}
          <span className="font-semibold text-slate-100">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1 || !!loading}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages || !!loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

