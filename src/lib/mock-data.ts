// lib/mock-data.ts
import { User, Vacancy, Candidate, Interview } from "@/types";
import { UserDto, AuthResponse } from "./api/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "hr.manager@vtb.com",
    firstName: "Anna",
    lastName: "Petrova",
    name: "Anna Petrova",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "user-2",
    email: "recruiter@vtb.com",
    firstName: "Ivan",
    lastName: "Smirnov",
    name: "Ivan Smirnov",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "user-3",
    email: "candidate@example.com",
    firstName: "Maria",
    lastName: "Ivanova",
    name: "Maria Ivanova",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

// Mock UserDto for API responses
export const mockUserDto: UserDto = {
  id: 1,
  email: "hr.manager@vtb.com",
  firstName: "Anna",
  lastName: "Petrova"
};

// Mock Auth Response
export const mockAuthResponse: AuthResponse = {
  accessToken: "mock_access_token_12345",
  refreshToken: "mock_refresh_token_67890",
  tokenType: "Bearer",
  expiresIn: 3600,
  user: mockUserDto
};

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
    createdAt: new Date("2024-01-15"),
    candidates: [
      { id: "1", name: "John Doe", matchScore: 85 },
      { id: "2", name: "Jane Smith", matchScore: 92 },
      { id: "3", name: "Alex Johnson", matchScore: 78 }
    ]
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
    createdAt: new Date("2024-01-20"),
    candidates: [
      { id: "4", name: "Mike Wilson", matchScore: 88 },
      { id: "5", name: "Sarah Davis", matchScore: 91 }
    ]
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
    createdAt: new Date("2024-01-10"),
    candidates: [
      { id: "6", name: "Emma Brown", matchScore: 79 },
      { id: "7", name: "David Lee", matchScore: 86 },
      { id: "8", name: "Lisa Chen", matchScore: 93 }
    ]
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
    createdAt: new Date("2024-01-25"),
    candidates: [
      { id: "9", name: "Tom Garcia", matchScore: 82 },
      { id: "10", name: "Anna Martinez", matchScore: 89 }
    ]
  },
  {
    id: "vac-5",
    title: "ИТ-специалист",
    department: "ИТ",
    location: "Москва",
    type: "Full-time",
    status: "Active",
    applicants: 15,
    interviewed: 4,
    description: "Ищем опытного ИТ-специалиста для поддержки и развития корпоративной ИТ-инфраструктуры банка.",
    requirements: [
      "Высшее техническое образование",
      "Опыт работы с корпоративными ИТ-системами от 3 лет",
      "Знание Windows Server, Active Directory",
      "Опыт администрирования баз данных",
      "Навыки работы с сетевым оборудованием",
      "Понимание принципов информационной безопасности"
    ],
    salary: { min: 120000, max: 180000, currency: "RUB" },
    createdAt: new Date("2024-01-30"),
    candidates: [
      { id: "87", name: "Журавлев Александр Александрович", matchScore: 94 }
    ]
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Александр Волков",
    email: "a.volkov@gmail.com",
    phone: "+7 (999) 123-45-67",
    position: "Senior Frontend Developer",
    experience: 6,
    skills: ["React", "TypeScript", "Next.js", "Redux", "GraphQL"],
    matchScore: 87,
    status: "Interview",
    resumeUrl: "/resumes/volkov_cv.pdf",
    appliedAt: new Date("2024-01-18")
  },
  {
    id: "cand-2",
    name: "Елена Соколова",
    email: "e.sokolova@mail.ru",
    phone: "+7 (999) 234-56-78",
    position: "DevOps Engineer",
    experience: 4,
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
    matchScore: 82,
    status: "Screening",
    resumeUrl: "/resumes/sokolova_cv.pdf",
    appliedAt: new Date("2024-01-22")
  },
  {
    id: "cand-3",
    name: "Дмитрий Кузнецов",
    email: "d.kuznetsov@yandex.ru",
    phone: "+7 (999) 345-67-89",
    position: "Product Manager",
    experience: 5,
    skills: ["Product Strategy", "Analytics", "Agile", "User Research", "SQL"],
    matchScore: 75,
    status: "New",
    resumeUrl: "/resumes/kuznetsov_cv.pdf",
    appliedAt: new Date("2024-01-24")
  },
  {
    id: "cand-4",
    name: "Наталия Федорова",
    email: "n.fedorova@gmail.com",
    phone: "+7 (999) 456-78-90",
    position: "UX/UI Designer",
    experience: 3,
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Testing"],
    matchScore: 84,
    status: "Offer",
    resumeUrl: "/resumes/fedorova_cv.pdf",
    appliedAt: new Date("2024-01-26")
  },
  {
    id: "cand-5",
    name: "Сергей Михайлов",
    email: "s.mikhailov@outlook.com",
    phone: "+7 (999) 567-89-01",
    position: "Senior Frontend Developer",
    experience: 8,
    skills: ["React", "Vue", "Angular", "TypeScript", "Node.js"],
    matchScore: 90,
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

// Additional mock data for API responses

// Mock Reports Data
export const mockReports = [
  {
    id: 1,
    candidateId: 1,
    candidateName: "Alexander Volkov",
    position: "Senior Frontend Developer",
    vacancy: "Senior Frontend Developer",
    status: "completed",
    jobId: 1,
    interviewId: 1,
    overallScore: 85,
    overallMatchScore: 88,
    technicalSkillsScore: 90,
    confirmedSkills: ["React", "TypeScript", "Node.js"],
    missingSkills: ["GraphQL", "Docker"],
    technicalDetails: "Strong technical foundation with modern frameworks",
    communicationScore: 82,
    communicationDetails: "Clear communication, good English proficiency",
    experienceScore: 87,
    relevantProjects: ["E-commerce platform", "Banking dashboard"],
    experienceDetails: "5+ years of relevant experience in fintech",
    totalQuestions: 15,
    questionsAnswered: 13,
    problemSolvingScore: 88,
    teamworkScore: 85,
    leadershipScore: 75,
    adaptabilityScore: 80,
    redFlags: ["Limited experience with testing"],
    strengths: ["Strong technical skills", "Good problem-solving", "Team player"],
    gaps: ["Testing knowledge", "DevOps experience"],
    recommendationDecision: "HIRE",
    recommendationConfidence: 85,
    recommendationReasoning: "Strong candidate with excellent technical skills",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z"
  },
  {
    id: 2,
    candidateId: 2,
    candidateName: "Maria Petrova",
    position: "DevOps Engineer",
    vacancy: "DevOps Engineer",
    status: "completed",
    jobId: 2,
    interviewId: 2,
    overallScore: 78,
    overallMatchScore: 80,
    technicalSkillsScore: 82,
    confirmedSkills: ["Docker", "Kubernetes", "AWS"],
    missingSkills: ["Terraform", "Monitoring"],
    technicalDetails: "Good DevOps knowledge, needs some improvement in IaC",
    communicationScore: 75,
    communicationDetails: "Adequate communication skills",
    experienceScore: 80,
    relevantProjects: ["Microservices migration", "CI/CD pipeline"],
    experienceDetails: "4 years of DevOps experience",
    totalQuestions: 12,
    questionsAnswered: 11,
    problemSolvingScore: 85,
    teamworkScore: 78,
    leadershipScore: 70,
    adaptabilityScore: 82,
    redFlags: [],
    strengths: ["Container orchestration", "Cloud platforms", "Problem solving"],
    gaps: ["Infrastructure as Code", "Monitoring tools"],
    recommendationDecision: "CONSIDER",
    recommendationConfidence: 75,
    recommendationReasoning: "Good candidate but needs development in some areas",
    createdAt: "2024-02-02T14:00:00Z",
    updatedAt: "2024-02-02T14:00:00Z"
  },
  {
    id: 3,
    candidateId: 3,
    candidateName: "Dmitry Kozlov",
    position: "Product Manager",
    vacancy: "Product Manager",
    status: "pending",
    jobId: 3,
    interviewId: 3,
    overallScore: 92,
    overallMatchScore: 94,
    technicalSkillsScore: 88,
    confirmedSkills: ["Product Strategy", "Analytics", "User Research"],
    missingSkills: ["A/B Testing", "SQL"],
    technicalDetails: "Excellent product thinking and strategic vision",
    communicationScore: 95,
    communicationDetails: "Outstanding communication and presentation skills",
    experienceScore: 90,
    relevantProjects: ["Mobile banking app", "Investment platform"],
    experienceDetails: "6+ years in fintech product management",
    totalQuestions: 18,
    questionsAnswered: 18,
    problemSolvingScore: 93,
    teamworkScore: 89,
    leadershipScore: 91,
    adaptabilityScore: 88,
    redFlags: [],
    strengths: ["Strategic thinking", "Leadership", "Customer focus", "Data-driven"],
    gaps: ["Technical analysis skills"],
    recommendationDecision: "STRONG_HIRE",
    recommendationConfidence: 92,
    recommendationReasoning: "Exceptional candidate with strong product leadership skills",
    createdAt: "2024-02-03T09:00:00Z",
    updatedAt: "2024-02-03T09:00:00Z"
  }
];

// Mock Statistics
export const mockStats = {
  vacancies: {
    total: 12,
    active: 8,
    paused: 2,
    closed: 2,
    totalCandidates: 156,
    totalInterviews: 45
  },
  candidates: {
    total: 156,
    new: 23,
    screening: 45,
    interview: 12,
    offer: 8,
    hired: 15,
    rejected: 53
  },
  interviews: {
    scheduled: 8,
    completed: 37,
    today: 3,
    thisWeek: 12
  }
};

// Mock Questions Data
export const mockQuestions = {
  technical: [
    {
      id: "tech-1",
      question: "Explain the difference between React hooks and class components",
      category: "technical",
      difficulty: "medium",
      expectedAnswer: "Hooks allow functional components to use state and lifecycle methods..."
    },
    {
      id: "tech-2", 
      question: "How would you optimize a React application for performance?",
      category: "technical",
      difficulty: "hard",
      expectedAnswer: "Use React.memo, useMemo, useCallback, code splitting..."
    }
  ],
  behavioral: [
    {
      id: "behav-1",
      question: "Tell me about a time when you had to work with a difficult team member",
      category: "behavioral",
      difficulty: "medium",
      expectedAnswer: "Look for conflict resolution skills and teamwork"
    },
    {
      id: "behav-2",
      question: "Describe a challenging project you worked on and how you overcame obstacles",
      category: "behavioral", 
      difficulty: "medium",
      expectedAnswer: "Look for problem-solving skills and resilience"
    }
  ],
  experience: [
    {
      id: "exp-1",
      question: "Walk me through your experience with React development",
      category: "experience",
      difficulty: "easy",
      expectedAnswer: "Look for specific projects and technologies used"
    },
    {
      id: "exp-2",
      question: "What was the most complex feature you've implemented?",
      category: "experience",
      difficulty: "medium", 
      expectedAnswer: "Look for technical depth and problem-solving approach"
    }
  ]
};

// Mock Today's Interviews
export const mockTodayInterviews = [
  {
    id: "today-1",
    candidateName: "Alexander Volkov",
    candidateId: "cand-1",
    position: "Senior Frontend Developer",
    time: "10:00",
    duration: 60,
    type: "Technical",
    status: "scheduled",
    interviewerName: "Anna Petrova"
  },
  {
    id: "today-2", 
    candidateName: "Elena Sokolova",
    candidateId: "cand-2",
    position: "DevOps Engineer", 
    time: "14:00",
    duration: 45,
    type: "Behavioral",
    status: "scheduled",
    interviewerName: "Ivan Smirnov"
  },
  {
    id: "today-3",
    candidateName: "Sergey Mikhailov", 
    candidateId: "cand-5",
    position: "Senior Frontend Developer",
    time: "16:30",
    duration: 60,
    type: "Final",
    status: "scheduled", 
    interviewerName: "Anna Petrova"
  }
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));