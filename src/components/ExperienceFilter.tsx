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
      <div className="text-sm font-medium text-[#152539]">Experience</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ExperienceFilterValue)}
        className="w-full rounded-lg border border-[#dce2ec] bg-white px-2.5 py-2 text-sm text-[#152539] outline-none focus:ring-2 focus:ring-[#8aafd4]/40"
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

