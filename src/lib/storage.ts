import type { UploadResponse } from "./types";

const LAST_RESULT_KEY = "resumeai:lastResult";
const ACTIVITY_KEY = "resumeai:activity";
const RESULT_FILTERS_KEY = "resumeai:resultFilters";

export type ActivityItem = {
  ts: number;
  fileCount: number;
  successCount: number;
  failedCount: number;
};

export type ResultFilters = {
  skills: string[];
  experience: "all" | "fresher" | "1" | "2" | "3plus";
};

function normalizeResult(result: UploadResponse): UploadResponse {
  return {
    ...result,
    data: (result.data || []).map((row) => {
      const skillsRaw = (row as unknown as { skills?: unknown }).skills;
      const normalizedSkills = Array.isArray(skillsRaw)
        ? skillsRaw.filter((s): s is string => typeof s === "string")
        : typeof skillsRaw === "string"
          ? skillsRaw
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

      return {
        ...row,
        skills: normalizedSkills,
        experience:
          typeof (row as unknown as { experience?: unknown }).experience === "string"
            ? ((row as unknown as { experience: string }).experience || null)
            : null,
        slug:
          typeof (row as unknown as { slug?: unknown }).slug === "string"
            ? ((row as unknown as { slug: string }).slug || null)
            : null,
      };
    }),
  };
}

export function saveLastResult(result: UploadResponse) {
  localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(normalizeResult(result)));
}

export function loadLastResult(): UploadResponse | null {
  const raw = localStorage.getItem(LAST_RESULT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as UploadResponse;
    return normalizeResult(parsed);
  } catch {
    return null;
  }
}

export function pushActivity(item: ActivityItem) {
  const existing = loadActivity();
  const next = [item, ...existing].slice(0, 25);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
}

export function loadActivity(): ActivityItem[] {
  const raw = localStorage.getItem(ACTIVITY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ActivityItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveResultFilters(filters: ResultFilters) {
  localStorage.setItem(RESULT_FILTERS_KEY, JSON.stringify(filters));
}

export function loadResultFilters(): ResultFilters {
  const raw = localStorage.getItem(RESULT_FILTERS_KEY);
  if (!raw) return { skills: [], experience: "all" };
  try {
    const parsed = JSON.parse(raw) as Partial<ResultFilters>;
    return {
      skills: Array.isArray(parsed.skills) ? parsed.skills.filter((s): s is string => typeof s === "string") : [],
      experience:
        parsed.experience === "fresher" ||
        parsed.experience === "1" ||
        parsed.experience === "2" ||
        parsed.experience === "3plus"
          ? parsed.experience
          : "all",
    };
  } catch {
    return { skills: [], experience: "all" };
  }
}

export function clearResultFilters() {
  localStorage.removeItem(RESULT_FILTERS_KEY);
}

