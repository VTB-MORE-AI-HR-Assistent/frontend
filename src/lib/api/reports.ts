import apiClient from "./client";

// Types based on Swagger schema
export interface CandidateReport {
  id: number;
  candidateId: number;
  jobId: number;
  interviewId: number;
  overallScore: number;
  overallMatchScore: number;
  technicalSkillsScore: number;
  confirmedSkills: string[];
  missingSkills: string[];
  technicalDetails?: string;
  communicationScore: number;
  communicationDetails?: string;
  experienceScore: number;
  relevantProjects: string[];
  experienceDetails?: string;
  totalQuestions: number;
  questionsAnswered: number;
  problemSolvingScore: number;
  teamworkScore: number;
  leadershipScore: number;
  adaptabilityScore: number;
  redFlags: string[];
  strengths: string[];
  gaps: string[];
  recommendationDecision: string;
  recommendationConfidence: number;
  recommendationReasoning?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateRecommendation {
  id: number;
  candidateId: number;
  jobId: number;
  interviewId: number;
  recommendationDecision: string;
  recommendationConfidence: number;
  recommendationReasoning?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MLReportDTO {
  candidateId: number;
  jobId: number;
  interviewId: number;
  overallScore: number;
  overallMatchScore: number;
  technicalSkillsScore: number;
  confirmedSkills: string[];
  missingSkills: string[];
  technicalDetails: string;
  communicationScore: number;
  communicationDetails: string;
  experienceScore: number;
  relevantProjects: string[];
  experienceDetails: string;
  totalQuestions: number;
  questionsAnswered: number;
  problemSolvingScore: number;
  teamworkScore: number;
  leadershipScore: number;
  adaptabilityScore: number;
  redFlags: string[];
  strengths: string[];
  gaps: string[];
  recommendationDecision: string;
  recommendationConfidence: number;
  recommendationReasoning: string;
  nextSteps: string[];
  candidatePositivePoints: string[];
  candidateImprovementAreas: string[];
}

export interface SaveReportResponse {
  message: string;
  reportId: number;
  recommendationId: number;
}

// API functions
export const reportsApi = {
  // Save ML Report
  saveMLReport: async (data: MLReportDTO): Promise<SaveReportResponse> => {
    const response = await apiClient.post("/v1/reports", data);
    return response.data;
  },

  // Get Candidate Report
  getCandidateReport: async (candidateId: number): Promise<CandidateReport> => {
    const response = await apiClient.get("/v1/reports/candidate", {
      params: { candidateId },
    });
    return response.data;
  },

  // Get Candidate Recommendation
  getCandidateRecommendation: async (
    candidateId: number
  ): Promise<CandidateRecommendation> => {
    const response = await apiClient.get("/v1/reports/recommendations", {
      params: { candidateId },
    });
    return response.data;
  },

  // Download PDF Report
  downloadCandidateReportPdf: async (candidateId: number): Promise<Blob> => {
    const response = await apiClient.get("/v1/reports/pdf", {
      params: { candidateId },
      responseType: "blob",
    });
    return response.data;
  },

  // Download Test PDF
  downloadTestPdf: async (): Promise<Blob> => {
    const response = await apiClient.get("/v1/reports/pdf/test", {
      responseType: "blob",
    });
    return response.data;
  },

  // Get Recent Reports
  getRecentReports: async (params: { limit?: number } = {}): Promise<CandidateReport[]> => {
    try {
      const response = await apiClient.get("/v1/reports", {
        params: {
          limit: params.limit || 10,
          sortBy: "createdAt",
          sortOrder: "desc"
        }
      });
      return response.data;
    } catch (error) {
      console.warn("Recent reports endpoint not available, returning empty array");
      return [];
    }
  },

  // Get All Reports (custom endpoint - you might need to add this to backend)
  getAllReports: async (): Promise<CandidateReport[]> => {
    try {
      // Since there's no "get all reports" endpoint in the swagger,
      // we'll need to either add it to the backend or use a different approach
      // For now, let's return empty array and handle this in the component
      return [];
    } catch (error) {
      console.error("Error fetching all reports:", error);
      return [];
    }
  },
};

// Default export for easier imports
export default reportsApi;

// Helper function to download PDF file
export const downloadPdfFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
