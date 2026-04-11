import type { CandidateFilters, CandidateListResponse, UploadResponse } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:8000";

export async function uploadResumes(
  files: File[],
  includeFields: string[] = ["name", "email", "phone", "skills", "experience"],
  manualSkills: string[] = [],
): Promise<UploadResponse> {
  const fd = new FormData();
  for (const f of files) fd.append("files", f);
  fd.append("include_fields", includeFields.join(","));
  if (manualSkills.length) fd.append("manual_skills", manualSkills.join(","));

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed (${res.status})`);
  }

  return (await res.json()) as UploadResponse;
}

type SubmitResumeResponse = {
  success: boolean;
  message: string;
};

export function submitResume(
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<SubmitResumeResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/submit-resume`);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };

    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText || "{}") as SubmitResumeResponse;
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(body);
          return;
        }
        reject(new Error((body as { detail?: string }).detail || body.message || "Submission failed"));
      } catch {
        reject(new Error(`Submission failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error while submitting resume"));
    xhr.send(formData);
  });
}

export async function fetchCandidates(filters: CandidateFilters): Promise<CandidateListResponse> {
  const params = new URLSearchParams();
  if (filters.start_date) params.set("start_date", filters.start_date);
  if (filters.end_date) params.set("end_date", filters.end_date);
  if (filters.skills?.length) params.set("skills", filters.skills.join(","));
  if (filters.experience) params.set("experience", filters.experience);
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  const url = query ? `${API_BASE}/candidates?${query}` : `${API_BASE}/candidates`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch candidates (${res.status})`);
  }
  return (await res.json()) as CandidateListResponse;
}

export async function deleteCandidate(candidateId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/candidates/${candidateId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to delete candidate (${res.status})`);
  }
}

