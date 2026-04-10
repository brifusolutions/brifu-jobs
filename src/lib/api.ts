import type { UploadResponse } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:8000";

export async function uploadResumes(
  files: File[],
  includeFields: string[] = ["name", "email", "phone", "skills", "experience"],
): Promise<UploadResponse> {
  const fd = new FormData();
  for (const f of files) fd.append("files", f);
  fd.append("include_fields", includeFields.join(","));

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

