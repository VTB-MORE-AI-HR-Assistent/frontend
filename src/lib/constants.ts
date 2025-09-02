// lib/constants.ts

// Application Constants
export const APP_NAME = "VTB AI HR Assistant";
export const APP_VERSION = "1.0.0";
export const COMPANY_NAME = "VTB Bank";

// API Endpoints (for future backend integration)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    RESET_PASSWORD: "/auth/reset-password",
  },
  VACANCIES: {
    LIST: "/vacancies",
    CREATE: "/vacancies/create",
    UPDATE: "/vacancies/:id",
    DELETE: "/vacancies/:id",
    GET_BY_ID: "/vacancies/:id",
  },
  CANDIDATES: {
    LIST: "/candidates",
    PROFILE: "/candidates/:id",
    UPDATE_STATUS: "/candidates/:id/status",
    DOCUMENTS: "/candidates/:id/documents",
  },
  INTERVIEWS: {
    LIST: "/interviews",
    SCHEDULE: "/interviews/schedule",
    UPDATE: "/interviews/:id",
    CANCEL: "/interviews/:id/cancel",
  },
};

// User Roles
export const USER_ROLES = {
  HR_MANAGER: "hr_manager",
  RECRUITER: "recruiter",
  CANDIDATE: "candidate",
  ADMIN: "admin",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Application Status Constants
export const VACANCY_STATUS = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  CLOSED: "Closed",
} as const;

export const CANDIDATE_STATUS = {
  NEW: "New",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
} as const;

export const INTERVIEW_STATUS = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "InProgress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const INTERVIEW_TYPES = {
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  CULTURAL: "Cultural",
} as const;

export const EMPLOYMENT_TYPES = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
} as const;

// UI Constants
export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [".pdf", ".doc", ".docx"];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy",
  DISPLAY_WITH_TIME: "dd MMM yyyy HH:mm",
  INPUT: "yyyy-MM-dd",
  API: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, and numbers",
  INVALID_PHONE: "Please enter a valid phone number",
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: `Only ${ALLOWED_FILE_TYPES.join(", ")} files are allowed`,
  NETWORK_ERROR: "Network error. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Successfully logged in",
  LOGOUT: "Successfully logged out",
  REGISTER: "Registration successful! Please check your email to verify your account.",
  PASSWORD_RESET: "Password reset link sent to your email",
  PROFILE_UPDATED: "Profile updated successfully",
  VACANCY_CREATED: "Vacancy created successfully",
  VACANCY_UPDATED: "Vacancy updated successfully",
  APPLICATION_SENT: "Application sent successfully",
  INTERVIEW_SCHEDULED: "Interview scheduled successfully",
};

// Navigation Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  
  // HR Routes
  HR_DASHBOARD: "/dashboard",
  HR_VACANCIES: "/dashboard/vacancies",
  HR_CANDIDATES: "/dashboard/candidates",
  HR_INTERVIEWS: "/dashboard/interviews",
  HR_CALENDAR: "/dashboard/calendar",
  HR_INTERVIEW_REPORTS: "/dashboard/interview-reports",
  HR_QUESTION_BANK: "/dashboard/question-bank",
  HR_ANALYTICS: "/dashboard/analytics",
  HR_SETTINGS: "/dashboard/settings",
  
  // Candidate Routes
  CANDIDATE_PORTAL: "/portal",
  CANDIDATE_PROFILE: "/portal/profile",
  CANDIDATE_APPLICATIONS: "/portal/applications",
  CANDIDATE_INTERVIEWS: "/portal/interviews",
  CANDIDATE_JOBS: "/portal/jobs",
  
  // Public Routes
  CAREERS: "/careers",
  JOB_DETAIL: "/careers/job/:id",
  ABOUT: "/about",
  CONTACT: "/contact",
};

// Chart Colors (for data visualization)
export const CHART_COLORS = {
  PRIMARY: "#1B4F8C",
  SECONDARY: "#2563EB",
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  DANGER: "#EF4444",
  INFO: "#3B82F6",
  NEUTRAL: "#6B7280",
};

// Skill Categories
export const SKILL_CATEGORIES = {
  TECHNICAL: "Technical",
  SOFT: "Soft Skills",
  LANGUAGES: "Languages",
  TOOLS: "Tools & Technologies",
  CERTIFICATIONS: "Certifications",
};

// Department List
export const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Success",
  "Legal",
  "Infrastructure",
  "Data Science",
];

// Location List
export const LOCATIONS = [
  "Moscow",
  "St. Petersburg",
  "Novosibirsk",
  "Yekaterinburg",
  "Nizhny Novgorod",
  "Kazan",
  "Chelyabinsk",
  "Omsk",
  "Samara",
  "Rostov-on-Don",
  "Remote",
];

// Experience Levels
export const EXPERIENCE_LEVELS = {
  JUNIOR: { label: "Junior", years: "0-2" },
  MIDDLE: { label: "Middle", years: "2-5" },
  SENIOR: { label: "Senior", years: "5-8" },
  LEAD: { label: "Lead", years: "8+" },
  EXPERT: { label: "Expert", years: "10+" },
};

// Match Score Ranges
export const MATCH_SCORE_RANGES = {
  EXCELLENT: { min: 90, max: 100, color: "#10B981" },
  GOOD: { min: 70, max: 89, color: "#3B82F6" },
  AVERAGE: { min: 50, max: 69, color: "#F59E0B" },
  LOW: { min: 0, max: 49, color: "#EF4444" },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "vtb_hr_auth_token",
  REFRESH_TOKEN: "vtb_hr_refresh_token",
  USER_PREFERENCES: "vtb_hr_user_preferences",
  THEME: "vtb_hr_theme",
  LANGUAGE: "vtb_hr_language",
};