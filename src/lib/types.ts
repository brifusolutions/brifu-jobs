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

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  resume_url: string;
  created_at: string;
};

export type CandidateListResponse = {
  items: Candidate[];
  total_count: number;
  filtered_count: number;
};

export type CandidateFilters = {
  start_date?: string;
  end_date?: string;
  skills?: string[];
  experience?: string;
  search?: string;
};

