// Phase 4.1: Interview API Service with Mock Implementation
// Note: Using mock data until backend is ready

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

// Mock data generator utilities
const generateMockSession = (sessionId: string): InterviewSession => ({
  sessionId,
  candidateId: `candidate_${Math.random().toString(36).substr(2, 9)}`,
  candidateName: ['John Doe', 'Jane Smith', 'Alex Johnson', 'Maria Garcia'][Math.floor(Math.random() * 4)],
  candidateEmail: `candidate${Math.floor(Math.random() * 100)}@example.com`,
  jobTitle: ['Senior Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer'][Math.floor(Math.random() * 4)],
  jobDescription: 'We are looking for an experienced developer to join our team...',
  department: 'Engineering',
  scheduledTime: new Date(Date.now() + 5 * 60000), // 5 minutes from now
  duration: 30,
  status: 'scheduled',
  interviewType: 'technical',
  difficulty: 'senior'
})

const generateMockToken = (): string => {
  // Generate a mock JWT-like token
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ 
    exp: Date.now() + 3600000,
    sessionId: Math.random().toString(36).substr(2, 9),
    role: 'participant'
  }))
  const signature = Math.random().toString(36).substr(2, 20)
  return `${header}.${payload}.${signature}`
}

// Mock delay to simulate network latency
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms))

// Interview API Service
export const interviewApi = {
  /**
   * Validate interview session
   * GET /api/interviews/validate/:sessionId
   */
  validateSession: async (sessionId: string, token?: string): Promise<ApiResponse<InterviewValidation>> => {
    console.log('[Mock API] Validating session:', sessionId)
    await mockDelay()

    // Mock validation logic
    const isValid = Math.random() > 0.2 // 80% success rate
    
    if (!token) {
      return {
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authentication token is required'
        }
      }
    }

    if (!isValid) {
      const errorTypes = [
        { code: 'SESSION_EXPIRED', message: 'This interview session has expired' },
        { code: 'INVALID_TOKEN', message: 'Invalid or expired authentication token' },
        { code: 'SESSION_NOT_FOUND', message: 'Interview session not found' }
      ]
      const error = errorTypes[Math.floor(Math.random() * errorTypes.length)]
      
      return {
        success: false,
        error
      }
    }

    return {
      success: true,
      data: {
        isValid: true,
        session: generateMockSession(sessionId),
        remainingTime: 30 // 30 minutes until expiry
      }
    }
  },

  /**
   * Get interview details
   * GET /api/interviews/:sessionId
   */
  getInterviewDetails: async (sessionId: string): Promise<ApiResponse<InterviewSession>> => {
    console.log('[Mock API] Getting interview details:', sessionId)
    await mockDelay(600)

    // 90% success rate for getting details
    if (Math.random() > 0.9) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Interview session not found'
        }
      }
    }

    return {
      success: true,
      data: generateMockSession(sessionId)
    }
  },

  /**
   * Start interview (join room)
   * POST /api/interviews/:sessionId/join
   */
  joinInterview: async (sessionId: string): Promise<ApiResponse<RoomCredentials>> => {
    console.log('[Mock API] Joining interview:', sessionId)
    await mockDelay(1000)

    // 95% success rate for joining
    if (Math.random() > 0.95) {
      return {
        success: false,
        error: {
          code: 'ROOM_CREATION_FAILED',
          message: 'Failed to create interview room. Please try again.'
        }
      }
    }

    // Generate mock Daily.co room credentials
    const roomCredentials: RoomCredentials = {
      roomUrl: `https://vtbaihr.daily.co/interview-${sessionId}`,
      token: generateMockToken(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      enableRecording: true,
      maxDuration: 60 // 60 minutes max
    }

    return {
      success: true,
      data: roomCredentials
    }
  },

  /**
   * End interview
   * POST /api/interviews/:sessionId/end
   */
  endInterview: async (sessionId: string, duration: number): Promise<ApiResponse<InterviewResult>> => {
    console.log('[Mock API] Ending interview:', sessionId, 'Duration:', duration)
    await mockDelay(500)

    // Always succeed for ending interview
    const result: InterviewResult = {
      sessionId,
      duration,
      completedAt: new Date(),
      status: 'completed',
      nextSteps: 'Thank you for participating. We will contact you within 2-3 business days with the results.'
    }

    return {
      success: true,
      data: result
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
    console.log('[Mock API] Reporting issue:', { sessionId, issueType, description })
    await mockDelay(400)

    // Always succeed for issue reporting
    const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Store the issue (in real implementation, this would go to backend)
    const issue: TechnicalIssue = {
      sessionId,
      issueType,
      description,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      resolved: false
    }

    console.log('[Mock API] Issue logged:', issue)

    return {
      success: true,
      data: { ticketId }
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
    console.log('[Mock API] Checking room status:', sessionId)
    await mockDelay(300)

    // Mock room status
    return {
      success: true,
      data: {
        isActive: Math.random() > 0.3,
        participantCount: Math.floor(Math.random() * 2) + 1,
        aiBotJoined: Math.random() > 0.2
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
    console.log('[Mock API] Getting interview questions:', sessionId)
    await mockDelay(700)

    const mockQuestions = [
      {
        id: 'q1',
        question: 'Tell me about yourself and your experience',
        category: 'introduction',
        difficulty: 'easy',
        expectedDuration: 120
      },
      {
        id: 'q2',
        question: 'What are your key technical skills?',
        category: 'technical',
        difficulty: 'medium',
        expectedDuration: 180
      },
      {
        id: 'q3',
        question: 'Describe a challenging project you worked on',
        category: 'behavioral',
        difficulty: 'medium',
        expectedDuration: 240
      },
      {
        id: 'q4',
        question: 'Where do you see yourself in 5 years?',
        category: 'cultural',
        difficulty: 'easy',
        expectedDuration: 120
      }
    ]

    return {
      success: true,
      data: { questions: mockQuestions }
    }
  }
}

// Export a mock-aware version that can be toggled
export const createInterviewApi = (useMock: boolean = true) => {
  if (!useMock) {
    // In future, this would return the real API implementation
    console.warn('Real API not implemented yet, using mock')
  }
  return interviewApi
}

// Default export
export default interviewApi