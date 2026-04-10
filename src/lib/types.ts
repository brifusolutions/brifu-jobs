export type ResumeRow = {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: string | null;
  slug: string | null;
  filename?: string;
  error?: string | null;
};

export type UploadResponse = {
  success: boolean;
  message: string;
  count: number;
  selected_fields?: string[];
  data: ResumeRow[];
  download_url: string;
};

