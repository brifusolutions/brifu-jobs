"use client";

export type ExperienceFilterValue = "all" | "fresher" | "1" | "2" | "3plus";

export function ExperienceFilter({
  value,
  onChange,
}: {
  value: ExperienceFilterValue;
  onChange: (next: ExperienceFilterValue) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-200">Experience</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ExperienceFilterValue)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-sm text-slate-100 outline-none ring-primary/30 focus:ring-2"
      >
        <option value="all">All</option>
        <option value="fresher">Fresher</option>
        <option value="1">1 Year</option>
        <option value="2">2 Years</option>
        <option value="3plus">3+ Years</option>
      </select>
    </div>
  );
}

