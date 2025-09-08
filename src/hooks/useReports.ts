import { useState, useEffect } from "react";
import { reportsApi, CandidateReport } from "@/lib/api/reports";
import { InterviewReport, transformReportData } from "@/types/reports";

export const useReports = () => {
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all reports from real API
      const allReports = await reportsApi.getAllReports();
      
      // Transform the reports to the expected format
      const transformedReports: InterviewReport[] = allReports.map(report => 
        transformReportData(
          report,
          report.candidateName,
          report.position,
          report.vacancy
        )
      );
      
      setReports(transformedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports");
      setReports([]);
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
