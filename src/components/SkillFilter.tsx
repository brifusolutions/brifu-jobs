"use client";

import { cn } from "@/lib/utils";

const DEFAULT_SKILLS = ["React", "JavaScript", "Python", "Java", "HTML", "CSS"] as const;

export function SkillFilter({
  selected,
  onChange,
  options = DEFAULT_SKILLS,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  options?: readonly string[];
}) {
  function toggle(skill: string) {
    const exists = selected.includes(skill);
    if (exists) onChange(selected.filter((s) => s !== skill));
    else onChange([...selected, skill]);
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-[#152539]">Skills</div>
      <div className="flex flex-wrap gap-2">
        {options.map((skill) => {
          const active = selected.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggle(skill)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs transition",
                active
                  ? "border-[#bfd4ea] bg-[#e3edf7] text-[#335c84]"
                  : "border-[#dce2ec] bg-white text-[#152539] hover:border-[#8aafd4]",
              )}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}

