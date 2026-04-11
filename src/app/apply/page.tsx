"use client";

import { FormEvent, useMemo, useState } from "react";

import { submitResume } from "@/lib/api";

export default function ApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPdf = useMemo(() => {
    if (!resume) return true;
    return resume.type === "application/pdf" || resume.name.toLowerCase().endsWith(".pdf");
  }, [resume]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!resume) {
      setError("Please upload your resume (PDF only).");
      return;
    }
    if (!isPdf) {
      setError("Only PDF resumes are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    formData.append("resume", resume);

    setSubmitting(true);
    setProgress(0);

    try {
      const response = await submitResume(formData, (percent) => setProgress(percent));
      setMessage(response.message || "Resume submitted successfully.");
      setName("");
      setEmail("");
      setPhone("");
      setResume(null);
      setProgress(100);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit resume.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-slate-900">Apply</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Submit your details and resume (PDF).</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500 focus:ring-2"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500 focus:ring-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500 focus:ring-2"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Resume Upload (PDF)</label>
            <input
              type="file"
              required
              accept=".pdf,application/pdf"
              onChange={(event) => setResume(event.target.files?.[0] || null)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white"
            />
            {!isPdf && <p className="mt-1 text-xs text-red-600">Only PDF files are allowed.</p>}
          </div>

          {submitting && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">Uploading... {progress}%</p>
            </div>
          )}

          {message && <p className="text-sm text-emerald-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
