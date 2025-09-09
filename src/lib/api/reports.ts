import { mockReports, simulateApiDelay } from "../mock-data";

// Types based on Swagger schema
export interface CandidateReport {
  id: number;
  candidateId: number;
  candidateName: string;
  position: string;
  vacancy: string;
  status: string;
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
  // Save ML Report - MOCKED
  saveMLReport: async (_data: MLReportDTO): Promise<SaveReportResponse> => {
    await simulateApiDelay(800);
    
    const reportId = Date.now();
    return {
      message: "Report saved successfully",
      reportId,
      recommendationId: reportId + 1
    };
  },

  // Get Candidate Report - MOCKED
  getCandidateReport: async (candidateId: number): Promise<CandidateReport> => {
    await simulateApiDelay(400);
    
    const report = mockReports.find(r => r.candidateId === candidateId);
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  },

  // Get Candidate Recommendation - MOCKED
  getCandidateRecommendation: async (
    candidateId: number
  ): Promise<CandidateRecommendation> => {
    await simulateApiDelay(300);
    
    const report = mockReports.find(r => r.candidateId === candidateId);
    if (!report) {
      throw new Error('Recommendation not found');
    }
    
    return {
      id: report.id,
      candidateId: report.candidateId,
      jobId: report.jobId,
      interviewId: report.interviewId,
      recommendationDecision: report.recommendationDecision,
      recommendationConfidence: report.recommendationConfidence,
      recommendationReasoning: report.recommendationReasoning,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    };
  },

  // Download PDF Report - MOCKED
  downloadCandidateReportPdf: async (candidateId: number): Promise<Blob> => {
    await simulateApiDelay(1000);
    
    // Create a mock PDF blob
    const pdfContent = `Mock PDF Report for Candidate ${candidateId}`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  },

  // Download Test PDF - MOCKED
  downloadTestPdf: async (): Promise<Blob> => {
    await simulateApiDelay(500);
    
    // Create a mock test PDF blob
    const pdfContent = 'Mock Test PDF Content';
    return new Blob([pdfContent], { type: 'application/pdf' });
  },

  // Get Recent Reports - MOCKED
  getRecentReports: async (params: { limit?: number } = {}): Promise<{ total: number; reports: CandidateReport[] }> => {
    await simulateApiDelay(400);
    
    const limit = params.limit || 10;
    const recentReports = mockReports
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    return {
      total: mockReports.length,
      reports: recentReports
    };
  },

  // Get All Reports - MOCKED
  getAllReports: async (): Promise<CandidateReport[]> => {
    await simulateApiDelay(600);
    return mockReports;
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
