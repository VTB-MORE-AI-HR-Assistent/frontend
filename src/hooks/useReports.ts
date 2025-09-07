import { useState, useEffect } from "react";
import { reportsApi, CandidateReport } from "@/lib/api/reports";
import { InterviewReport, transformReportData } from "@/types/reports";

// Mock candidate data - ВСЕГДА показываем этих кандидатов
const mockCandidateData = [
  {
    id: 123,
    name: "Maria Petrova",
    position: "Senior Frontend Developer",
    vacancy: "Frontend Developer - React",
  },
  {
    id: 124,
    name: "Alexander Smirnov",
    position: "Backend Developer",
    vacancy: "Backend Developer - Python",
  },
  {
    id: 125,
    name: "Elena Kozlova",
    position: "Product Manager",
    vacancy: "Senior Product Manager",
  },
  {
    id: 126,
    name: "Ivan Petrov",
    position: "DevOps Engineer",
    vacancy: "DevOps Engineer - AWS",
  },
];

// Fallback report data для кандидатов без реальных отчетов
const createMockReport = (
  candidate: (typeof mockCandidateData)[0]
): InterviewReport => ({
  id: candidate.id,
  candidateId: candidate.id,
  candidateName: candidate.name,
  position: candidate.position,
  vacancy: candidate.vacancy,
  interviewDate: new Date().toISOString().split("T")[0],
  interviewDuration: "45 min",
  overallCompliance: 0,
  aiRecommendation: "clarification",
  status: "pending",
  experienceRelevance: 0,
  competencies: {
    technical: { score: 0, strengths: [], gaps: ["No data available"] },
    behavioral: { score: 0, strengths: [], gaps: ["No data available"] },
    cultural: { score: 0, strengths: [], gaps: ["No data available"] },
  },
  redFlags: [],
  contradictions: [],
  personalizedFeedback:
    "Interview report not yet available. Please check back later.",
});

export const useReports = () => {
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Создаем отчеты для ВСЕХ замоканных кандидатов
      const allReports: InterviewReport[] = [];

      for (const candidate of mockCandidateData) {
        try {
          // Пытаемся получить реальный отчет из API
          const apiReport = await reportsApi.getCandidateReport(candidate.id);
          const realReport = transformReportData(
            apiReport,
            candidate.name,
            candidate.position,
            candidate.vacancy
          );
          allReports.push(realReport);
        } catch (err) {
          // Если отчета нет - создаем mock отчет для кандидата
          console.warn(
            `No report found for candidate ${candidate.id}, using mock data`
          );
          const mockReport = createMockReport(candidate);
          allReports.push(mockReport);
        }
      }

      setReports(allReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      // Если общая ошибка - показываем всех кандидатов с mock данными
      const fallbackReports = mockCandidateData.map(createMockReport);
      setReports(fallbackReports);
      setError("Failed to fetch some reports, showing mock data");
    } finally {
      setLoading(false);
    }
  };

  const getCandidateReport = async (
    candidateId: number
  ): Promise<CandidateReport | null> => {
    try {
      return await reportsApi.getCandidateReport(candidateId);
    } catch (err) {
      console.error(`Error fetching report for candidate ${candidateId}:`, err);
      return null;
    }
  };

  const downloadReportPdf = async (
    candidateId: number,
    candidateName: string
  ) => {
    try {
      const blob = await reportsApi.downloadCandidateReportPdf(candidateId);
      const filename = `candidate_report_${candidateId}_${candidateName.replace(
        " ",
        "_"
      )}.pdf`;

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Error downloading PDF for candidate ${candidateId}:`, err);
      throw new Error("Failed to download PDF report");
    }
  };

  const downloadTestPdf = async () => {
    try {
      const blob = await reportsApi.downloadTestPdf();
      const filename = "test_report.pdf";

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading test PDF:", err);
      throw new Error("Failed to download test PDF");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports,
    getCandidateReport,
    downloadReportPdf,
    downloadTestPdf,
  };
};
