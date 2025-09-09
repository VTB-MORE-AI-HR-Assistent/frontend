// types/index.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  status: "Active" | "Paused" | "Closed";
  applicants: number;
  interviewed: number;
  description: string;
  requirements: string[];
  salary: { min: number; max: number; currency: string };
  createdAt: Date;
  candidates: { id: string; name: string; matchScore: number }[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  matchScore: number;
  status: "New" | "Screening" | "Interview" | "Offer" | "Rejected";
  resumeUrl?: string;
  appliedAt: Date;
}

export interface Interview {
  id: string;
  candidateId: string;
  vacancyId: string;
  scheduledAt: Date;
  duration: number;
  type: "Technical" | "Behavioral" | "Cultural";
  status: "Scheduled" | "InProgress" | "Completed" | "Cancelled";
  score?: number;
  feedback?: string;
}