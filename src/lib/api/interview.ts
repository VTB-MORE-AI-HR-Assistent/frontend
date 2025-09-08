// Real Interview API Service - integrated with backend microservices
// This replaces the previous mock implementation

import interviewsApi from './interviews'

// TypeScript Interfaces
export interface InterviewSession {
  sessionId: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  jobTitle: string
  jobDescription?: string
  department?: string
  scheduledTime: Date
  duration: number // in minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'expired'
  interviewType: 'technical' | 'behavioral' | 'cultural' | 'mixed'
  difficulty: 'junior' | 'middle' | 'senior'
}

export interface InterviewValidation {
  isValid: boolean
  session?: InterviewSession
  error?: string
  remainingTime?: number // minutes until expiry
}

export interface RoomCredentials {
  roomUrl: string
  token: string
  expiresAt: Date
  enableRecording: boolean
  maxDuration: number // in minutes
}

export interface InterviewResult {
  sessionId: string
  duration: number // actual duration in seconds
  completedAt: Date
  status: 'completed' | 'terminated' | 'technical_issue'
  nextSteps?: string
}

export interface TechnicalIssue {
  sessionId: string
  issueType: 'audio' | 'connection' | 'browser' | 'other'
  description: string
  timestamp: Date
  userAgent?: string
  resolved?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Test session store for backward compatibility (can be removed when no longer needed)
const testSessions = new Map<string, InterviewSession>()

// Helper function to register test sessions
export function registerTestSession(data: {
  sessionId: string
  candidateName: string
  candidateEmail: string
  position: string
  scheduledTime: Date
  duration: number
}) {
  const session: InterviewSession = {
    sessionId: data.sessionId,
    candidateId: `test_candidate_${Date.now()}`,
    candidateName: data.candidateName,
    candidateEmail: data.candidateEmail,
    jobTitle: data.position,
    jobDescription: `Interview for ${data.position} position at VTB`,
    department: 'Engineering',
    scheduledTime: data.scheduledTime,
    duration: data.duration,
    status: 'scheduled',
    interviewType: 'technical',
    difficulty: 'senior'
  }
  testSessions.set(data.sessionId, session)
  return session
}

// Helper function to get test session
export function getTestSession(sessionId: string): InterviewSession | undefined {
  return testSessions.get(sessionId)
}

// Helper functions for backward compatibility
const convertToLegacyFormat = (session: any): InterviewSession => {
  return {
    sessionId: session.id,
    candidateId: session.candidateId,
    candidateName: session.candidateName,
    candidateEmail: session.candidateEmail,
    jobTitle: session.jobTitle,
    jobDescription: session.jobDescription,
    department: session.department,
    scheduledTime: new Date(session.scheduledTime),
    duration: session.duration,
    status: session.status,
    interviewType: session.interviewType,
    difficulty: session.difficulty
  }
}

// Interview API Service - now using real backend
export const interviewApi = {
  /**
   * Validate interview session
   * GET /api/interviews/validate/:sessionId
   */
  validateSession: async (sessionId: string, token?: string): Promise<ApiResponse<InterviewValidation>> => {
    try {
      const result = await interviewsApi.validateSession(sessionId, token)
      return {
        success: true,
        data: {
          isValid: result.isValid,
          session: result.session ? convertToLegacyFormat(result.session) : undefined,
          remainingTime: result.remainingTime
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'VALIDATION_ERROR',
          message: error.message || 'Failed to validate session'
        }
      }
    }
  },

  /**
   * Get interview details
   * GET /api/interviews/:sessionId
   */
  getInterviewDetails: async (sessionId: string): Promise<ApiResponse<InterviewSession>> => {
    try {
      const session = await interviewsApi.getInterview(sessionId)
      return {
        success: true,
        data: convertToLegacyFormat(session)
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'NOT_FOUND',
          message: error.message || 'Interview session not found'
        }
      }
    }
  },

  /**
   * Start interview (join room)
   * POST /api/interviews/:sessionId/join
   */
  joinInterview: async (sessionId: string): Promise<ApiResponse<RoomCredentials>> => {
    try {
      const credentials = await interviewsApi.joinInterview(sessionId)
      return {
        success: true,
        data: {
          roomUrl: credentials.roomUrl,
          token: credentials.token,
          expiresAt: new Date(credentials.expiresAt),
          enableRecording: credentials.enableRecording,
          maxDuration: credentials.maxDuration
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'ROOM_CREATION_FAILED',
          message: error.message || 'Failed to create interview room. Please try again.'
        }
      }
    }
  },

  /**
   * End interview
   * POST /api/interviews/:sessionId/end
   */
  endInterview: async (sessionId: string, duration: number): Promise<ApiResponse<InterviewResult>> => {
    try {
      const result = await interviewsApi.endInterview(sessionId, { duration })
      return {
        success: true,
        data: {
          sessionId: result.sessionId,
          duration: result.duration,
          completedAt: new Date(result.completedAt),
          status: result.status,
          nextSteps: result.nextSteps
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'END_FAILED',
          message: error.message || 'Failed to end interview'
        }
      }
    }
  },

  /**
   * Report technical issue
   * POST /api/interviews/:sessionId/report-issue
   */
  reportIssue: async (
    sessionId: string, 
    issueType: TechnicalIssue['issueType'], 
    description: string
  ): Promise<ApiResponse<{ ticketId: string }>> => {
    try {
      const result = await interviewsApi.reportIssue(sessionId, {
        issueType,
        description,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
      })
      return {
        success: true,
        data: { ticketId: result.ticketId }
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'REPORT_FAILED',
          message: error.message || 'Failed to report issue'
        }
      }
    }
  },

  /**
   * Check interview room status (additional helper)
   */
  checkRoomStatus: async (sessionId: string): Promise<ApiResponse<{ 
    isActive: boolean, 
    participantCount: number,
    aiBotJoined: boolean 
  }>> => {
    try {
      const status = await interviewsApi.getRoomStatus(sessionId)
      return {
        success: true,
        data: {
          isActive: status.isActive,
          participantCount: status.participantCount,
          aiBotJoined: status.aiBotJoined
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'STATUS_ERROR',
          message: error.message || 'Failed to check room status'
        }
      }
    }
  },

  /**
   * Get interview questions (for AI bot preparation)
   */
  getInterviewQuestions: async (sessionId: string): Promise<ApiResponse<{
    questions: Array<{
      id: string
      question: string
      category: string
      difficulty: string
      expectedDuration: number
    }>
  }>> => {
    try {
      const questions = await interviewsApi.getQuestions(sessionId)
      return {
        success: true,
        data: { questions }
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'QUESTIONS_ERROR',
          message: error.message || 'Failed to get interview questions'
        }
      }
    }
  }
}

// Export real API implementation (no longer mock)
export const createInterviewApi = (useMock: boolean = false) => {
  // Always use real API now
  return interviewApi
}

// Default export
export default interviewApi