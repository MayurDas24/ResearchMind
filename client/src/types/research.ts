//client/src/types/research.ts
export type ResearchStatus =
  | "queued"
  | "searching"
  | "reading"
  | "rag"
  | "writing"
  | "critic"
  | "completed"
  | "failed";

export interface Research {
  _id: string;
  user: string | null;
  topic: string;
  report: string;
  sources: string[];
  feedback: string;
  confidence: number;
  scrapedContent: string;
  runtime: number;
  status: ResearchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobUpdatePayload {
  jobId: string;
  researchId: string;
  stage: string;
  progress: number;
  status: string;
}