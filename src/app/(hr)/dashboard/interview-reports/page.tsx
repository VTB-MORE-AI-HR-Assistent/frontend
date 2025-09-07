"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  FileText,
  Download,
  Eye,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  Clock,
  Video,
  Mic,
  Target,
  Award,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Flag,
  ChevronRight,
  Star,
  Shield,
  Lightbulb,
  BookOpen,
  Send,
  RefreshCw,
} from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { InterviewReport } from "@/types/reports";

// This component now uses real API data instead of mock data

export default function InterviewReportsPage() {
  const {
    reports,
    loading,
    error,
    refetch,
    downloadReportPdf,
    downloadTestPdf,
  } = useReports();
  const [selectedReport, setSelectedReport] = useState<InterviewReport | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVacancy, setSelectedVacancy] = useState("all");

  // Set first report as selected when reports are loaded
  useEffect(() => {
    if (reports.length > 0 && !selectedReport) {
      setSelectedReport(reports[0]);
    }
  }, [reports, selectedReport]);

  // Get unique vacancies for filter
  const vacancies = Array.from(new Set(reports.map((r) => r.vacancy)));

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "next-stage":
        return "bg-green-100 text-green-800";
      case "clarification":
        return "bg-amber-100 text-amber-800";
      case "rejection":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || report.status === filterStatus;
    const matchesVacancy =
      selectedVacancy === "all" || report.vacancy === selectedVacancy;
    return matchesSearch && matchesFilter && matchesVacancy;
  });

  const handleDownloadPdf = async () => {
    if (!selectedReport) return;

    try {
      await downloadReportPdf(
        selectedReport.candidateId,
        selectedReport.candidateName
      );
    } catch (err) {
      console.error("Failed to download PDF:", err);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 mx-auto text-[#1B4F8C] animate-pulse" />
          <p className="text-muted-foreground">
            Loading AI Interview Reports...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
          <p className="text-muted-foreground">
            Error loading reports: {error}
          </p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <p className="text-muted-foreground">No interview reports found</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedReport) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 pb-20 md:pb-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            AI Interview Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Review AI-conducted interviews and assessment results
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 h-9"
            prefix={<Search className="h-4 w-4" />}
          />
          <Select value={selectedVacancy} onValueChange={setSelectedVacancy}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder="Filter by vacancy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vacancies</SelectItem>
              {vacancies.map((vacancy) => (
                <SelectItem key={vacancy} value={vacancy}>
                  {vacancy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-3 w-3" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={downloadTestPdf}
          >
            <Download className="mr-2 h-3 w-3" />
            Test PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Interview List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Interviews</CardTitle>
            <CardDescription className="text-xs">
              AI-conducted interview sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedReport.id === report.id
                        ? "border-[#1B4F8C] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {report.candidateName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {report.candidateName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {report.position}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Compliance
                        </span>
                        <span
                          className={`font-semibold text-sm ${getComplianceColor(
                            report.overallCompliance
                          )}`}
                        >
                          {report.overallCompliance}%
                        </span>
                      </div>

                      <Progress
                        value={report.overallCompliance}
                        className="h-2"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <Badge
                          className={`text-[10px] py-0 px-1.5 h-5 ${getRecommendationColor(
                            report.aiRecommendation
                          )}`}
                        >
                          {report.aiRecommendation === "next-stage" &&
                            "Next Stage"}
                          {report.aiRecommendation === "clarification" &&
                            "Needs Clarification"}
                          {report.aiRecommendation === "rejection" && "Reject"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {report.interviewDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detailed Report */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Interview Assessment Report
                </CardTitle>
                <CardDescription className="text-xs">
                  AI analysis for {selectedReport.candidateName} -{" "}
                  {selectedReport.position}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="competencies">Competencies</TabsTrigger>
                <TabsTrigger value="redflags">Red Flags</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Main Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Position Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-2xl font-bold ${getComplianceColor(
                            selectedReport.overallCompliance
                          )}`}
                        >
                          {selectedReport.overallCompliance}%
                        </div>
                        <Target
                          className={`h-6 w-6 ${getComplianceColor(
                            selectedReport.overallCompliance
                          )}`}
                        />
                      </div>
                      <Progress
                        value={selectedReport.overallCompliance}
                        className="mt-3 h-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Experience Relevance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-2xl font-bold ${getComplianceColor(
                            selectedReport.experienceRelevance
                          )}`}
                        >
                          {selectedReport.experienceRelevance}%
                        </div>
                        <Award
                          className={`h-6 w-6 ${getComplianceColor(
                            selectedReport.experienceRelevance
                          )}`}
                        />
                      </div>
                      <Progress
                        value={selectedReport.experienceRelevance}
                        className="mt-3 h-2"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* AI Recommendation */}
                <Alert
                  className={`text-xs ${
                    selectedReport.aiRecommendation === "next-stage"
                      ? "border-green-200 bg-green-50"
                      : selectedReport.aiRecommendation === "clarification"
                      ? "border-amber-200 bg-amber-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <Brain className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    <strong>AI Recommendation:</strong>{" "}
                    {selectedReport.aiRecommendation === "next-stage" &&
                      "Proceed to next interview stage"}
                    {selectedReport.aiRecommendation === "clarification" &&
                      "Schedule clarification call with HR"}
                    {selectedReport.aiRecommendation === "rejection" &&
                      "Not suitable for this position"}
                  </AlertDescription>
                </Alert>

                {/* Interview Details */}
                <div className="grid grid-cols-1 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Interview Date
                      </span>
                      <span className="font-medium">
                        {selectedReport.interviewDate}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Competencies Tab */}
              <TabsContent value="competencies" className="space-y-4">
                {Object.entries(selectedReport.competencies).map(
                  ([key, value]) => (
                    <Card key={key}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base capitalize">
                            {key} Skills
                          </CardTitle>
                          <span
                            className={`text-lg font-bold ${getComplianceColor(
                              value.score
                            )}`}
                          >
                            {value.score}%
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Progress value={value.score} className="h-2" />

                        {value.strengths.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              Strengths
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {value.strengths.map((strength, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-[10px] py-0 px-1.5 h-5 border-green-200 bg-green-50"
                                >
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {value.gaps.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-amber-700 mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Areas for Improvement
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {value.gaps.map((gap, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-[10px] py-0 px-1.5 h-5 border-amber-200 bg-amber-50"
                                >
                                  {gap}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                )}
              </TabsContent>

              {/* Red Flags Tab */}
              <TabsContent value="redflags" className="space-y-4">
                {selectedReport.redFlags.length === 0 &&
                selectedReport.contradictions.length === 0 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <AlertDescription className="text-xs">
                      <strong>No red flags or contradictions detected.</strong>{" "}
                      The candidate provided consistent and genuine responses
                      throughout the interview.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {selectedReport.redFlags.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Flag className="h-4 w-4 text-red-500" />
                            Red Flags Detected
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedReport.redFlags.map((flag, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertCircle className="h-3 w-3 text-red-500 mt-0.5" />
                                <span className="text-xs">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {selectedReport.contradictions.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Contradictions Found
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedReport.contradictions.map(
                              (contradiction, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5" />
                                  <span className="text-xs">
                                    {contradiction}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Feedback Tab */}
              <TabsContent value="feedback" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Personalized Candidate Feedback
                    </CardTitle>
                    <CardDescription className="text-xs">
                      AI-generated feedback to share with the candidate
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs leading-relaxed">
                        {selectedReport.personalizedFeedback}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Send className="mr-2 h-3 w-3" />
                        Send to Candidate
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedReport.aiRecommendation === "next-stage" && (
                      <>
                        <Button
                          className="w-full justify-start text-xs"
                          variant="outline"
                          size="sm"
                        >
                          <Calendar className="mr-2 h-3 w-3" />
                          Schedule Next Interview Round
                        </Button>
                        <Button
                          className="w-full justify-start text-xs"
                          variant="outline"
                          size="sm"
                        >
                          <User className="mr-2 h-3 w-3" />
                          Assign to Hiring Manager
                        </Button>
                      </>
                    )}
                    {selectedReport.aiRecommendation === "clarification" && (
                      <Button
                        className="w-full justify-start text-xs"
                        variant="outline"
                        size="sm"
                      >
                        <Video className="mr-2 h-3 w-3" />
                        Schedule Clarification Call
                      </Button>
                    )}
                    <Button
                      className="w-full justify-start text-xs"
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="mr-2 h-3 w-3" />
                      Generate Detailed Report
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
