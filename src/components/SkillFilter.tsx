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
      <div className="text-sm font-medium text-slate-200">Skills</div>
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
                  ? "border-primary bg-primary/20 text-sky-200"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-slate-100",
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

