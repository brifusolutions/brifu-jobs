"use client";

import { FileText, UploadCloud, X } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function UploadBox({
  files,
  onFilesChange,
  disabled,
}: {
  files: File[];
  onFilesChange: (next: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const stats = useMemo(() => {
    const count = files.length;
    const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
    return { count, totalBytes };
  }, [files]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list).filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    const next = [...files, ...picked];
    const seen = new Set<string>();
    const deduped = next.filter((f) => {
      const key = `${f.name}_${f.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    onFilesChange(deduped);
  }

  return (
    <div className="card p-6">
      <div
        className={cn(
          "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/40 p-6 text-center transition",
          dragActive && "border-primary bg-blue-950/30",
          disabled && "cursor-not-allowed opacity-70",
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (disabled) return;
          addFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
          disabled={disabled}
        />

        <div className="flex items-center gap-2 text-primary">
          <UploadCloud className="h-6 w-6" />
          <span className="text-sm font-semibold">Drag & drop PDFs here</span>
        </div>
        <div className="mt-2 text-sm text-slate-400">
          or click to browse. PDF only. Multi-file supported.
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-slate-300">
          <span className="rounded-full bg-slate-800 px-3 py-1 shadow-sm">
            {stats.count} file{stats.count === 1 ? "" : "s"}
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 shadow-sm">
            {formatBytes(stats.totalBytes)}
          </span>
        </div>
      </div>

      {files.length ? (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-100">Selected files</div>
            <button
              type="button"
              className="text-sm font-semibold text-slate-400 hover:text-slate-100"
              onClick={() => onFilesChange([])}
              disabled={disabled}
            >
              Clear
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {files.map((f) => (
              <li
                key={`${f.name}_${f.size}`}
                className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800">
                    <FileText className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-100">
                      {f.name}
                    </div>
                    <div className="text-xs text-slate-400">{formatBytes(f.size)}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-800 hover:text-slate-100"
                  onClick={() =>
                    onFilesChange(files.filter((x) => !(x.name === f.name && x.size === f.size)))
                  }
                  disabled={disabled}
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

