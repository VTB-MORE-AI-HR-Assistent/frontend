// Extended types for the frontend reports page
export interface InterviewReport {
  id: number;
  candidateId: number;
  candidateName: string;
  position: string;
  vacancy: string;
  interviewDate: string;
  interviewDuration: string;
  overallCompliance: number;
  aiRecommendation: "next-stage" | "clarification" | "rejection";
  status: "pending" | "reviewed" | "approved" | "rejected";
  experienceRelevance: number;
  competencies: {
    technical: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    behavioral: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    cultural: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
  };
  redFlags: string[];
  contradictions: string[];
  personalizedFeedback: string;
}

// Function to transform API data to frontend format
export const transformReportData = (
  report: any,
  candidateName: string,
  position: string,
  vacancy: string
): InterviewReport => {
  // Map recommendation decision to frontend format
  const getAiRecommendation = (
    decision: string
  ): "next-stage" | "clarification" | "rejection" => {
    switch (decision.toLowerCase()) {
      case "hire":
        return "next-stage";
      case "maybe":
        return "clarification";
      case "no_hire":
        return "rejection";
      default:
        return "clarification";
    }
  };

  // Generate status based on recommendation and other factors
  const getStatus = (
    recommendation: string,
    score: number
  ): "pending" | "reviewed" | "approved" | "rejected" => {
    if (recommendation === "next-stage" && score >= 80) return "approved";
    if (recommendation === "rejection") return "rejected";
    return "reviewed";
  };

  return {
    id: report.id,
    candidateId: report.candidateId,
    candidateName,
    position,
    vacancy,
    interviewDate: new Date(report.createdAt).toISOString().split("T")[0],
    interviewDuration: "45 min", // Default, could be calculated from interview data
    overallCompliance: report.overallScore,
    aiRecommendation: getAiRecommendation(report.recommendationDecision),
    status: getStatus(
      getAiRecommendation(report.recommendationDecision),
      report.overallScore
    ),
    experienceRelevance: report.experienceScore,
    competencies: {
      technical: {
        score: report.technicalSkillsScore,
        strengths: report.confirmedSkills,
        gaps: report.missingSkills,
      },
      behavioral: {
        score: Math.round((report.teamworkScore + report.leadershipScore) / 2),
        strengths: report.strengths.filter(
          (s: string) =>
            s.toLowerCase().includes("communication") ||
            s.toLowerCase().includes("leadership") ||
            s.toLowerCase().includes("teamwork")
        ),
        gaps: report.gaps.filter(
          (g: string) =>
            g.toLowerCase().includes("communication") ||
            g.toLowerCase().includes("leadership") ||
            g.toLowerCase().includes("teamwork")
        ),
      },
      cultural: {
        score: report.adaptabilityScore,
        strengths: report.strengths.filter(
          (s: string) =>
            s.toLowerCase().includes("cultural") ||
            s.toLowerCase().includes("adaptability") ||
            s.toLowerCase().includes("innovation")
        ),
        gaps: report.gaps.filter(
          (g: string) =>
            g.toLowerCase().includes("cultural") ||
            g.toLowerCase().includes("adaptability")
        ),
      },
    },
    redFlags: report.redFlags,
    contradictions: [], // Not directly available in API, could be derived from redFlags
    personalizedFeedback:
      report.recommendationReasoning || "No feedback available.",
  };
};
