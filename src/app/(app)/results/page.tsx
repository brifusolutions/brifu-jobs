"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { API_BASE } from "@/lib/api";
import { clearResultFilters, loadLastResult, loadResultFilters, saveLastResult } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { Download } from "lucide-react";
import type { ResumeRow, UploadResponse } from "@/lib/types";
import type { ExperienceFilterValue } from "@/components/ExperienceFilter";

export default function ResultsPage() {
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [rows, setRows] = useState<ResumeRow[]>([]);
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterExperience, setFilterExperience] = useState<ExperienceFilterValue>("all");
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loaded = loadLastResult();
    const filters = loadResultFilters();
    setResult(loaded);
    setRows(loaded?.data || []);
    setFilterSkills(filters.skills || []);
    setFilterExperience(filters.experience || "all");
  }, []);

  const downloadUrl = result?.download_url ? `${API_BASE}${result.download_url}` : null;
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const skillPass =
        !filterSkills.length ||
        filterSkills.some((selected) => (row.skills || []).some((s) => s.toLowerCase() === selected.toLowerCase()));
      if (!skillPass) return false;

      if (filterExperience === "all") return true;
      const numeric = parseFloat((row.experience || "").toLowerCase().replace(/[^\d.]/g, ""));
      if (filterExperience === "fresher") return !numeric || numeric <= 0;
      if (!Number.isFinite(numeric)) return false;
      if (filterExperience === "1") return Math.floor(numeric) === 1;
      if (filterExperience === "2") return Math.floor(numeric) === 2;
      return numeric >= 3;
    });
  }, [rows, filterExperience, filterSkills]);
  const resultCount = useMemo(() => filteredRows.length, [filteredRows.length]);

  function deleteRow(row: ResumeRow) {
    setRows((prev) => {
      const index = prev.findIndex((x) => x === row);
      const next =
        index >= 0
          ? prev.filter((_, i) => i !== index)
          : prev.filter(
              (x) =>
                !(
                  x.name === row.name &&
                  x.email === row.email &&
                  x.phone === row.phone &&
                  x.experience === row.experience &&
                  JSON.stringify(x.skills || []) === JSON.stringify(row.skills || []) &&
                  x.slug === row.slug &&
                  x.error === row.error
                ),
            );

      if (result) {
        const updated: UploadResponse = {
          ...result,
          count: next.length,
          data: next,
        };
        setResult(updated);
        saveLastResult(updated);
      }
      return next;
    });

    toast({ type: "info", title: "Candidate removed", description: "Row deleted from current results." });
  }

  async function onExport() {
    if (!downloadUrl) {
      toast({ type: "error", title: "Nothing to export", description: "Run processing first." });
      return;
    }
    setDownloading(true);
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({ type: "success", title: "Export complete", description: "Excel file downloaded." });
    } catch (e) {
      toast({
        type: "error",
        title: "Export failed",
        description: e instanceof Error ? e.message : "Something went wrong",
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-white">Parsed Results</div>
          <div className="mt-1 text-sm text-slate-400">
            Search, sort, delete, and export parsed candidate data. {result ? `${resultCount} shown.` : ""}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Filters: {filterSkills.length ? `Skills (${filterSkills.join(", ")})` : "Skills (All)"} | Experience (
            {filterExperience === "all"
              ? "All"
              : filterExperience === "fresher"
                ? "Fresher"
                : filterExperience === "3plus"
                  ? "3+ Years"
                  : `${filterExperience} Year${filterExperience === "1" ? "" : "s"}`
            })
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary rounded-lg px-2.5 py-2 text-xs"
            onClick={() => {
              setFilterSkills([]);
              setFilterExperience("all");
              clearResultFilters();
            }}
          >
            Clear Filters
          </button>
          <button
            type="button"
            className="btn-primary rounded-xl px-3.5 py-2"
            onClick={onExport}
            disabled={!downloadUrl || downloading}
          >
            <Download className="h-4 w-4" />
            {downloading ? "Exporting…" : "Export to Excel"}
          </button>
        </div>
      </div>

      <DataTable
        rows={filteredRows}
        loading={!result}
        onDeleteRow={deleteRow}
        showSkills
        showExperience
      />
    </div>
  );
}

