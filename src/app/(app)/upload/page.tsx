"use client";

import React, { useEffect, useRef, useState } from "react";
import { CompactUploadBox } from "@/components/CompactUploadBox";
import { SmallProgressBar } from "@/components/SmallProgressBar";
import { SkillFilter } from "@/components/SkillFilter";
import { ExperienceFilter, type ExperienceFilterValue } from "@/components/ExperienceFilter";
import { Loader } from "@/components/Loader";
import { uploadResumes } from "@/lib/api";
import { pushActivity, saveLastResult, saveResultFilters } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzeSkills, setAnalyzeSkills] = useState(true);
  const [analyzeExperience, setAnalyzeExperience] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceFilterValue>("all");
  const progressTimer = useRef<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (progressTimer.current) window.clearInterval(progressTimer.current);
    };
  }, []);

  async function onProcess() {
    if (!files.length) {
      toast({ type: "error", title: "No files selected", description: "Please add at least one PDF." });
      return;
    }
    setLoading(true);
    setProgress(8);
    progressTimer.current = window.setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.max(1, Math.round((90 - p) / 10)) : p));
    }, 350);

    try {
      const includeFields = ["name", "email", "phone"];
      if (analyzeSkills) includeFields.push("skills");
      if (analyzeExperience) includeFields.push("experience");

      const result = await uploadResumes(files, includeFields);

      saveLastResult(result);
      saveResultFilters({ skills: selectedSkills, experience: selectedExperience });

      const failedCount = result.data.filter((r) => r.error).length;
      const successCount = result.data.length - failedCount;
      pushActivity({
        ts: Date.now(),
        fileCount: result.count,
        successCount,
        failedCount,
      });

      setProgress(100);
      toast({ type: "success", title: "Upload success", description: result.message });
      router.push("/results");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast({ type: "error", title: "Processing failed", description: msg });
    } finally {
      if (progressTimer.current) window.clearInterval(progressTimer.current);
      progressTimer.current = null;
      window.setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 400);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold tracking-tight text-white">Upload Resumes</div>
        <div className="mt-1 text-sm text-slate-400">
          Upload one or more PDFs. We’ll extract name, email, phone, skills, and experience.
        </div>
      </div>

      <CompactUploadBox files={files} onFilesChange={setFiles} disabled={loading} />

      <div className="card p-4">
        <div className="text-sm font-semibold text-slate-100">Data To Analyze</div>
        <div className="mt-1 text-xs text-slate-400">
          Name, Email, and Phone are always included. Select extra fields if needed.
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-primary"
              checked={analyzeSkills}
              onChange={(e) => setAnalyzeSkills(e.target.checked)}
              disabled={loading}
            />
            Analyze Skills
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-primary"
              checked={analyzeExperience}
              onChange={(e) => setAnalyzeExperience(e.target.checked)}
              disabled={loading}
            />
            Analyze Experience
          </label>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">Filter Candidates</div>
            <div className="text-xs text-slate-400">Apply after processing on results table.</div>
          </div>
          <button
            type="button"
            className="btn-secondary rounded-lg px-2.5 py-1.5 text-xs"
            onClick={() => {
              setSelectedSkills([]);
              setSelectedExperience("all");
            }}
            disabled={loading}
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <SkillFilter selected={selectedSkills} onChange={setSelectedSkills} />
          <ExperienceFilter value={selectedExperience} onChange={setSelectedExperience} />
        </div>

        <div className="mt-2 text-xs text-slate-400">
          {selectedSkills.length ? `Skills: ${selectedSkills.join(", ")}` : "Skills: All"} | Experience:{" "}
          {selectedExperience === "all"
            ? "All"
            : selectedExperience === "fresher"
              ? "Fresher"
              : selectedExperience === "3plus"
                ? "3+ Years"
                : `${selectedExperience} Year${selectedExperience === "1" ? "" : "s"}`}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-100">Processing</div>
            <div className="mt-1 text-xs text-slate-400">
              {loading ? "Analyzing resumes…" : "Ready when you are."}
            </div>
          </div>
          <button
            type="button"
            className="btn-primary rounded-lg px-3 py-1.5 text-sm"
            onClick={onProcess}
            disabled={loading || !files.length}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 border-t-white" />
                Processing…
              </>
            ) : (
              "Start Processing"
            )}
          </button>
        </div>

        <div className="mt-3">
          <SmallProgressBar value={loading ? progress : 0} />
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>{loading ? `${progress}%` : "0%"}</span>
            <span>
              {Math.min(files.length, Math.floor((Math.max(progress, 1) / 100) * files.length))}/{files.length} files
              processed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

