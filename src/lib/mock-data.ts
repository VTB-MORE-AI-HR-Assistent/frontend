// lib/mock-data.ts
import { User, Vacancy, Candidate, Interview } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "hr.manager@vtb.com",
    firstName: "Anna",
    lastName: "Petrova",
    password: "hashed_password_123"
  },
  {
    id: "user-2",
    email: "recruiter@vtb.com",
    firstName: "Ivan",
    lastName: "Smirnov",
    password: "hashed_password_456"
  },
  {
    id: "user-3",
    email: "candidate@example.com",
    firstName: "Maria",
    lastName: "Ivanova",
    password: "hashed_password_789"
  }
];

export const mockVacancies: Vacancy[] = [
  {
    id: "vac-1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Moscow",
    type: "Full-time",
    status: "Active",
    applicants: 47,
    interviewed: 12,
    description: "We are looking for an experienced Frontend Developer to join our digital transformation team.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with modern CSS frameworks",
      "Knowledge of state management solutions"
    ],
    salary: { min: 200000, max: 300000, currency: "RUB" },
    createdAt: new Date("2024-01-15")
  },
  {
    id: "vac-2",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "St. Petersburg",
    type: "Full-time",
    status: "Active",
    applicants: 32,
    interviewed: 8,
    description: "Join our Infrastructure team to help build and maintain our cloud platform.",
    requirements: [
      "Experience with Kubernetes and Docker",
      "Strong knowledge of CI/CD pipelines",
      "Cloud platforms (AWS/Azure/GCP)",
      "Infrastructure as Code (Terraform/Ansible)"
    ],
    salary: { min: 250000, max: 350000, currency: "RUB" },
    createdAt: new Date("2024-01-20")
  },
  {
    id: "vac-3",
    title: "Product Manager",
    department: "Product",
    location: "Moscow",
    type: "Full-time",
    status: "Paused",
    applicants: 65,
    interviewed: 18,
    description: "We need a Product Manager to lead our mobile banking initiatives.",
    requirements: [
      "3+ years in product management",
      "Experience in fintech/banking",
      "Strong analytical skills",
      "Excellent communication abilities"
    ],
    salary: { min: 180000, max: 280000, currency: "RUB" },
    createdAt: new Date("2024-01-10")
  },
  {
    id: "vac-4",
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
    status: "Active",
    applicants: 28,
    interviewed: 6,
    description: "Looking for a creative UX/UI Designer for our digital products.",
    requirements: [
      "Portfolio demonstrating UX/UI projects",
      "Proficiency in Figma",
      "Understanding of design systems",
      "Mobile design experience"
    ],
    salary: { min: 150000, max: 220000, currency: "RUB" },
    createdAt: new Date("2024-01-25")
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Alexander Volkov",
    email: "a.volkov@gmail.com",
    phone: "+7 (999) 123-45-67",
    position: "Senior Frontend Developer",
    experience: 6,
    skills: ["React", "TypeScript", "Next.js", "Redux", "GraphQL"],
    matchScore: 92,
    status: "Interview",
    resumeUrl: "/resumes/volkov_cv.pdf",
    appliedAt: new Date("2024-01-18")
  },
  {
    id: "cand-2",
    name: "Elena Sokolova",
    email: "e.sokolova@mail.ru",
    phone: "+7 (999) 234-56-78",
    position: "DevOps Engineer",
    experience: 4,
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
    matchScore: 85,
    status: "Screening",
    resumeUrl: "/resumes/sokolova_cv.pdf",
    appliedAt: new Date("2024-01-22")
  },
  {
    id: "cand-3",
    name: "Dmitry Kuznetsov",
    email: "d.kuznetsov@yandex.ru",
    phone: "+7 (999) 345-67-89",
    position: "Product Manager",
    experience: 5,
    skills: ["Product Strategy", "Analytics", "Agile", "User Research", "SQL"],
    matchScore: 78,
    status: "New",
    resumeUrl: "/resumes/kuznetsov_cv.pdf",
    appliedAt: new Date("2024-01-24")
  },
  {
    id: "cand-4",
    name: "Natalia Fedorova",
    email: "n.fedorova@gmail.com",
    phone: "+7 (999) 456-78-90",
    position: "UX/UI Designer",
    experience: 3,
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Testing"],
    matchScore: 88,
    status: "Offer",
    resumeUrl: "/resumes/fedorova_cv.pdf",
    appliedAt: new Date("2024-01-26")
  },
  {
    id: "cand-5",
    name: "Sergey Mikhailov",
    email: "s.mikhailov@outlook.com",
    phone: "+7 (999) 567-89-01",
    position: "Senior Frontend Developer",
    experience: 8,
    skills: ["React", "Vue", "Angular", "TypeScript", "Node.js"],
    matchScore: 95,
    status: "Interview",
    resumeUrl: "/resumes/mikhailov_cv.pdf",
    appliedAt: new Date("2024-01-19")
  }
];

export const mockInterviews: Interview[] = [
  {
    id: "int-1",
    candidateId: "cand-1",
    vacancyId: "vac-1",
    scheduledAt: new Date("2024-02-05T10:00:00"),
    duration: 60,
    type: "Technical",
    status: "Scheduled",
    score: undefined,
    feedback: undefined
  },
  {
    id: "int-2",
    candidateId: "cand-5",
    vacancyId: "vac-1",
    scheduledAt: new Date("2024-02-03T14:00:00"),
    duration: 45,
    type: "Behavioral",
    status: "Completed",
    score: 9,
    feedback: "Excellent communication skills and technical knowledge. Strong candidate."
  },
  {
    id: "int-3",
    candidateId: "cand-2",
    vacancyId: "vac-2",
    scheduledAt: new Date("2024-02-06T11:00:00"),
    duration: 60,
    type: "Technical",
    status: "Scheduled",
    score: undefined,
    feedback: undefined
  },
  {
    id: "int-4",
    candidateId: "cand-4",
    vacancyId: "vac-4",
    scheduledAt: new Date("2024-02-02T15:00:00"),
    duration: 30,
    type: "Cultural",
    status: "Completed",
    score: 8,
    feedback: "Great portfolio and cultural fit. Ready for offer."
  }
];

// Helper functions for data manipulation
export const getVacancyById = (id: string) => 
  mockVacancies.find(v => v.id === id);

export const getCandidateById = (id: string) => 
  mockCandidates.find(c => c.id === id);

export const getInterviewById = (id: string) => 
  mockInterviews.find(i => i.id === id);

export const getCandidatesByVacancy = (vacancyId: string) => {
  const interviewCandidateIds = mockInterviews
    .filter(i => i.vacancyId === vacancyId)
    .map(i => i.candidateId);
  
  return mockCandidates.filter(c => interviewCandidateIds.includes(c.id));
};

export const getInterviewsByCandidateId = (candidateId: string) => 
  mockInterviews.filter(i => i.candidateId === candidateId);

export const getActiveVacancies = () => 
  mockVacancies.filter(v => v.status === "Active");

export const getUpcomingInterviews = () => 
  mockInterviews.filter(i => 
    i.status === "Scheduled" && 
    i.scheduledAt > new Date()
  );