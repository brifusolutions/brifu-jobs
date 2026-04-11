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

export function CompactUploadBox({
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
    <div className="card p-4">
      <div
        className={cn(
          "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#dce2ec] bg-white p-4 text-center transition",
          dragActive && "border-[#8aafd4] bg-[#f6f9fd]",
          disabled && "cursor-not-allowed opacity-70",
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setDragActive(true);
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
          if (!disabled) addFiles(e.dataTransfer.files);
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
          <UploadCloud className="h-4 w-4" />
          <span className="text-sm font-semibold">Drag & drop PDF resumes</span>
        </div>
        <div className="mt-1 text-xs text-[#6c7a89]">or click to browse</div>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#6c7a89]">
          <span className="rounded-full bg-[#eef3f8] px-2 py-0.5">
            {stats.count} file{stats.count === 1 ? "" : "s"}
          </span>
          <span className="rounded-full bg-[#eef3f8] px-2 py-0.5">{formatBytes(stats.totalBytes)}</span>
        </div>
      </div>

      {files.length ? (
        <ul className="mt-3 space-y-1.5">
          {files.map((f) => (
            <li
              key={`${f.name}_${f.size}`}
              className="flex items-center justify-between rounded-lg border border-[#dce2ec] bg-white px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 text-[#6c7a89]" />
                <div className="min-w-0">
                  <div className="truncate text-sm text-[#152539]">{f.name}</div>
                  <div className="text-xs text-[#6c7a89]">{formatBytes(f.size)}</div>
                </div>
              </div>
              <button
                type="button"
                className="rounded p-1 text-[#6c7a89] hover:bg-[#f0f2f7] hover:text-[#152539]"
                onClick={() => onFilesChange(files.filter((x) => !(x.name === f.name && x.size === f.size)))}
                disabled={disabled}
                aria-label={`Remove ${f.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

