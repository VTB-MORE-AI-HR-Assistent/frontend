import { useState, useEffect } from "react";
import { reportsApi, CandidateReport } from "@/lib/api/reports";
import { InterviewReport, transformReportData } from "@/types/reports";

// Mock candidate data - in a real app, this would come from candidates API
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

export const useReports = () => {
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Since the API doesn't have a "get all reports" endpoint,
      // we'll try to fetch reports for known candidates
      const reportPromises = mockCandidateData.map(async (candidate) => {
        try {
          const report = await reportsApi.getCandidateReport(candidate.id);
          return transformReportData(
            report,
            candidate.name,
            candidate.position,
            candidate.vacancy
          );
        } catch (err) {
          // If no report found for this candidate, skip it
          console.warn(`No report found for candidate ${candidate.id}`);
          return null;
        }
      });

      const results = await Promise.all(reportPromises);
      const validReports = results.filter(
        (report): report is InterviewReport => report !== null
      );

      setReports(validReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports");
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
