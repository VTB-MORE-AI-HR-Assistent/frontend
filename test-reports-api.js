#!/usr/bin/env node

/**
 * Test script for Reports API integration
 * Run with: node test-reports-api.js
 */

const axios = require("axios");

const API_BASE_URL = process.env.API_URL || "http://localhost:8081";
const TEST_CANDIDATE_ID = 123;

console.log("🧪 Testing Reports API Integration");
console.log("==================================");
console.log("API Base URL:", API_BASE_URL);
console.log("");

// Mock JWT token - replace with real token in production
const MOCK_TOKEN = "eyJhbGciOiJIUzUxMiJ9.test.token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${MOCK_TOKEN}`,
  },
});

async function testEndpoint(name, method, url, data = null) {
  try {
    console.log(`📡 Testing ${name}...`);
    console.log(`   ${method} ${url}`);

    let response;
    if (method === "GET") {
      response = await apiClient.get(url);
    } else if (method === "POST") {
      response = await apiClient.post(url, data);
    }

    console.log(`   ✅ SUCCESS (${response.status})`);
    console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    console.log("");
    return true;
  } catch (error) {
    console.log(`   ❌ FAILED`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error:`, error.response.data);
    } else {
      console.log(`   Error:`, error.message);
    }
    console.log("");
    return false;
  }
}

async function runTests() {
  console.log("Starting API tests...\n");

  // Test 1: Get candidate report
  await testEndpoint(
    "Get Candidate Report",
    "GET",
    `/api/v1/reports/candidate?candidateId=${TEST_CANDIDATE_ID}`
  );

  // Test 2: Get candidate recommendation
  await testEndpoint(
    "Get Candidate Recommendation",
    "GET",
    `/api/v1/reports/recommendations?candidateId=${TEST_CANDIDATE_ID}`
  );

  // Test 3: Download test PDF
  try {
    console.log("📡 Testing Download Test PDF...");
    console.log("   GET /api/v1/reports/pdf/test");

    const response = await apiClient.get("/api/v1/reports/pdf/test", {
      responseType: "blob",
    });

    console.log(`   ✅ SUCCESS (${response.status})`);
    console.log(`   PDF Size: ${response.data.size} bytes`);
    console.log(`   Content-Type: ${response.headers["content-type"]}`);
    console.log("");
  } catch (error) {
    console.log("   ❌ FAILED");
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
    } else {
      console.log(`   Error:`, error.message);
    }
    console.log("");
  }

  // Test 4: Save ML Report (optional)
  const sampleMLReport = {
    candidateId: TEST_CANDIDATE_ID,
    jobId: 456,
    interviewId: 789,
    overallScore: 85,
    overallMatchScore: 90,
    technicalSkillsScore: 80,
    confirmedSkills: ["JavaScript", "React", "Node.js"],
    missingSkills: ["Docker", "Kubernetes"],
    technicalDetails: "Strong frontend skills with React and JavaScript",
    communicationScore: 85,
    communicationDetails: "Clear communication during technical discussions",
    experienceScore: 75,
    relevantProjects: ["E-commerce Platform", "Banking System"],
    experienceDetails: "3 years of frontend development experience",
    totalQuestions: 10,
    questionsAnswered: 8,
    problemSolvingScore: 85,
    teamworkScore: 80,
    leadershipScore: 75,
    adaptabilityScore: 90,
    redFlags: [],
    strengths: ["Technical expertise", "Problem solving"],
    gaps: ["Cloud technologies"],
    recommendationDecision: "HIRE",
    recommendationConfidence: 0.85,
    recommendationReasoning: "Strong technical skills and good cultural fit",
    nextSteps: ["Technical interview", "Reference check"],
    candidatePositivePoints: ["Enthusiastic", "Quick learner"],
    candidateImprovementAreas: ["Cloud experience"],
  };

  await testEndpoint(
    "Save ML Report",
    "POST",
    "/api/v1/reports",
    sampleMLReport
  );

  console.log("🎯 Tests completed!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Make sure all services are running:");
  console.log("   - API Gateway on port 8081");
  console.log("   - Report Service on port 8085");
  console.log("   - PostgreSQL database");
  console.log("");
  console.log("2. Check the frontend application:");
  console.log("   - Navigate to /dashboard/interview-reports");
  console.log("   - Verify data loads from API");
  console.log("   - Test PDF download functionality");
}

runTests().catch(console.error);
