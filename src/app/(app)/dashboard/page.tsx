"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { deleteCandidate, fetchCandidates } from "@/lib/api";
import type { Candidate } from "@/lib/types";

type ExperienceOption = "" | "fresher" | "1" | "2" | "3plus";

export default function DashboardPage() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [totalResumes, setTotalResumes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState<ExperienceOption>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [manualSkillInput, setManualSkillInput] = useState("");

  const availableSkills = useMemo(() => {
    const all = new Set<string>();
    items.forEach((row) => row.skills.forEach((skill) => all.add(skill)));
    return Array.from(all).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const skillsDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((row) => {
      row.skills.forEach((skill) => {
        counts.set(skill, (counts.get(skill) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [items]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCandidates({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          skills: selectedSkills.length ? selectedSkills : undefined,
          experience: experience || undefined,
          search: search.trim() || undefined,
        });
        setItems(response.items);
        setTotalResumes(response.total_count);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load candidates.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [startDate, endDate, selectedSkills, experience, search]);

  async function onDeleteCandidate(candidateId: string) {
    const ok = window.confirm("Delete this candidate?");
    if (!ok) return;
    try {
      setDeletingId(candidateId);
      await deleteCandidate(candidateId);
      setItems((prev) => prev.filter((item) => item.id !== candidateId));
      setTotalResumes((prev) => Math.max(0, prev - 1));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete candidate.");
    } finally {
      setDeletingId(null);
    }
  }

  function onAddManualSkill() {
    const value = manualSkillInput.trim().toLowerCase();
    if (!value) return;
    setSelectedSkills((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setManualSkillInput("");
  }

  const avgExperience =
    Math.round(
      items.reduce((sum, candidate) => {
        const value = parseFloat((candidate.experience || "").replace(/[^\d.]/g, ""));
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0) / Math.max(items.length, 1),
    ) || 0;

  return (
    <div className="space-y-3">
      <section className="card flex items-center justify-between p-3.5">
        <div>
          <div className="text-sm font-semibold text-[#152539]">Admin Dashboard</div>
          <div className="text-xs text-[#6c7a89]">Manage results and open public apply form.</div>
        </div>
        <Link href="/apply" className="btn-primary h-8 px-3 text-xs">
          Open Apply Form
        </Link>
      </section>

      <section className="card p-3.5">
        <div className="grid gap-2 md:grid-cols-2">
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="h-8 rounded border border-[#dce2ec] bg-white px-2.5 text-sm text-[#1c2d42]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="h-8 rounded border border-[#dce2ec] bg-white px-2.5 text-sm text-[#1c2d42]"
          />
          <select
            value={experience}
            onChange={(event) => setExperience(event.target.value as ExperienceOption)}
            className="h-8 rounded border border-[#dce2ec] bg-white px-2.5 text-sm text-[#1c2d42]"
          >
            <option value="">All Experience</option>
            <option value="fresher">Fresher</option>
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3plus">3+ Years</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, phone..."
            className="h-8 rounded border border-[#dce2ec] bg-white px-2.5 text-sm text-[#1c2d42] placeholder:text-[#95a3b5]"
          />
        </div>
        <div className="mb-2 mt-3 text-[10px] uppercase tracking-[0.1em] text-[#8a97a9]">Skill Filter</div>
        <div className="mb-2 grid grid-cols-[1fr_auto] gap-2">
          <input
            type="text"
            value={manualSkillInput}
            onChange={(event) => setManualSkillInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAddManualSkill();
              }
            }}
            placeholder="Add a skill..."
            className="h-8 rounded border border-[#dce2ec] bg-white px-2.5 text-sm text-[#1c2d42] placeholder:text-[#95a3b5]"
          />
          <button type="button" onClick={onAddManualSkill} className="btn-secondary h-8 px-3 text-xs">
            Add
          </button>
        </div>
        {selectedSkills.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {selectedSkills.map((skill) => (
              <button
                key={`selected-${skill}`}
                type="button"
                onClick={() => setSelectedSkills((prev) => prev.filter((item) => item !== skill))}
                className="rounded border border-[#bfd4ea] bg-[#e3edf7] px-2 py-0.5 text-[11px] text-[#335c84]"
                title="Remove skill filter"
              >
                {skill} ×
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {availableSkills.length === 0 && <span className="text-xs text-[#7b8da1]">No skills found yet.</span>}
          {availableSkills.map((skill) => {
            const active = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() =>
                  setSelectedSkills((prev) =>
                    prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill],
                  )
                }
                className={`rounded border px-2 py-0.5 text-[11px] ${
                  active ? "border-[#bfd4ea] bg-[#e3edf7] text-[#335c84]" : "border-[#dce2ec] bg-white text-[#6f8195]"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-2 md:grid-cols-4">
        <article className="card p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a97a9]">Total Resumes</p>
          <p className="mt-1 text-[38px] leading-none text-[#1e3856]" style={{ fontFamily: "var(--font-cormorant)" }}>
            {totalResumes}
          </p>
        </article>
        <article className="card p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a97a9]">Filtered Results</p>
          <p className="mt-1 text-[38px] leading-none text-[#1e3856]" style={{ fontFamily: "var(--font-cormorant)" }}>
            {items.length}
          </p>
        </article>
        <article className="card p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a97a9]">Top Skill</p>
          <p className="mt-1 text-[38px] leading-none text-[#1e3856]" style={{ fontFamily: "var(--font-cormorant)" }}>
            {skillsDistribution[0]?.[0] || "-"}
          </p>
        </article>
        <article className="card p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a97a9]">Avg Experience</p>
          <p className="mt-1 text-[38px] leading-none text-[#1e3856]" style={{ fontFamily: "var(--font-cormorant)" }}>
            {avgExperience}
          </p>
        </article>
      </section>

      <section className="card p-3">
        <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a97a9]">Skills Distribution</p>
        <div className="mt-3 flex h-28 items-end gap-2 border-t border-[#dce2ec] pt-2">
          {skillsDistribution.length === 0 && <span className="text-xs text-[#7b8da1]">No distribution data available.</span>}
          {skillsDistribution.map(([skill, count], index) => (
            <div key={skill} className="flex w-10 flex-col items-center gap-1">
              <div
                className={`w-7 border border-[#dce2ec] bg-[#edf2f8] ${index % 2 === 0 ? "border-t-[3px] border-t-[#8aafd4]" : "border-t-[3px] border-t-[#d0bf8f]"}`}
                style={{ height: `${Math.min(90, 20 + count * 12)}%` }}
              />
              <span className="text-[10px] text-[#7b8da1]">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white text-[10px] uppercase tracking-[0.08em] text-[#8896a8]">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Skills</th>
                <th className="px-3 py-2">Experience</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-3 py-3 text-[#6c7a89]" colSpan={7}>
                    Loading candidates...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td className="px-3 py-3 text-red-500" colSpan={7}>
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && items.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-[#6c7a89]" colSpan={7}>
                    No candidates found for selected filters.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                items.map((candidate) => (
                  <tr key={candidate.id} className="border-t border-[#dce2ec] align-top">
                    <td className="px-3 py-2">{candidate.name || "-"}</td>
                    <td className="px-3 py-2 text-[#6c7a89]">{candidate.email || "-"}</td>
                    <td className="px-3 py-2">{candidate.phone || "-"}</td>
                    <td className="px-3 py-2">
                      {(candidate.skills || []).length ? (
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill) => (
                            <span
                              key={`${candidate.id}-${skill}`}
                              className="rounded border border-[#c7d9eb] bg-[#e1eaf4] px-1.5 py-0.5 text-[10px] text-[#2e587f]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="rounded border border-[#b8e0de] bg-[#d8f0ef] px-1.5 py-0.5 text-[10px] text-[#2f6c69]">
                        {candidate.experience || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => onDeleteCandidate(candidate.id)}
                        disabled={deletingId === candidate.id}
                        className="rounded border border-[#c98282] bg-transparent px-2 py-1 text-[11px] text-[#a25b5b] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === candidate.id ? "Deleting..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

