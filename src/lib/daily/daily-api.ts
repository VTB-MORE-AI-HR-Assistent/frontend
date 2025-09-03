// Daily.co API Service for room management
import { NextResponse } from 'next/server'

const DAILY_API_KEY = process.env.NEXT_PUBLIC_DAILY_API_KEY || ''
const DAILY_DOMAIN = process.env.NEXT_PUBLIC_DAILY_DOMAIN || ''
const DAILY_API_BASE = 'https://api.daily.co/v1'

export interface DailyRoom {
  id: string
  name: string
  url: string
  created_at: string
  privacy: 'public' | 'private'
  properties?: {
    enable_recording?: boolean
    enable_chat?: boolean
    enable_screenshare?: boolean
    max_participants?: number
    exp?: number // Unix timestamp when room expires
    lang?: string
  }
}

export interface DailyMeetingToken {
  token: string
}

export interface CreateRoomOptions {
  name?: string
  privacy?: 'public' | 'private'
  properties?: {
    enable_recording?: boolean
    enable_chat?: boolean
    enable_screenshare?: boolean
    max_participants?: number
    exp?: number
    lang?: string
    enable_prejoin_ui?: boolean
    enable_network_ui?: boolean
    enable_people_ui?: boolean
  }
}

export interface CreateTokenOptions {
  room_name: string
  user_name?: string
  is_owner?: boolean
  enable_recording?: boolean
  exp?: number // Unix timestamp when token expires
  lang?: string
}

export class DailyApiService {
  private apiKey: string
  private domain: string

  constructor() {
    this.apiKey = DAILY_API_KEY
    this.domain = DAILY_DOMAIN
    
    if (!this.apiKey) {
      console.warn('[DailyApiService] No API key found in environment variables')
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Create a new Daily.co room
   */
  async createRoom(options: CreateRoomOptions = {}): Promise<DailyRoom | null> {
    if (!this.apiKey) {
      console.error('[DailyApiService] Cannot create room without API key')
      return null
    }

    try {
      // Generate a unique room name if not provided
      const roomName = options.name || `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Set default properties
      const roomData = {
        name: roomName,
        privacy: options.privacy || 'public',
        properties: {
          enable_recording: options.properties?.enable_recording ?? false,
          enable_chat: options.properties?.enable_chat ?? true,
          enable_screenshare: options.properties?.enable_screenshare ?? true,
          max_participants: options.properties?.max_participants ?? 2,
          // Room expires in 24 hours by default
          exp: options.properties?.exp ?? Math.floor(Date.now() / 1000) + (24 * 60 * 60),
          lang: options.properties?.lang ?? 'ru',
          enable_prejoin_ui: options.properties?.enable_prejoin_ui ?? false,
          enable_network_ui: options.properties?.enable_network_ui ?? true,
          enable_people_ui: options.properties?.enable_people_ui ?? true,
          ...options.properties
        }
      }

      console.log('[DailyApiService] Creating room:', roomName)

      const response = await fetch(`${DAILY_API_BASE}/rooms`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(roomData)
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('[DailyApiService] Failed to create room:', error)
        return null
      }

      const room = await response.json()
      console.log('[DailyApiService] Room created successfully:', room.url)
      return room
    } catch (error) {
      console.error('[DailyApiService] Error creating room:', error)
      return null
    }
  }

  /**
   * Get an existing Daily.co room by name
   */
  async getRoom(roomName: string): Promise<DailyRoom | null> {
    if (!this.apiKey) {
      console.error('[DailyApiService] Cannot get room without API key')
      return null
    }

    try {
      const response = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.log('[DailyApiService] Room not found:', roomName)
        } else {
          console.error('[DailyApiService] Failed to get room:', await response.text())
        }
        return null
      }

      const room = await response.json()
      return room
    } catch (error) {
      console.error('[DailyApiService] Error getting room:', error)
      return null
    }
  }

  /**
   * Delete a Daily.co room
   */
  async deleteRoom(roomName: string): Promise<boolean> {
    if (!this.apiKey) {
      console.error('[DailyApiService] Cannot delete room without API key')
      return false
    }

    try {
      const response = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        console.error('[DailyApiService] Failed to delete room:', await response.text())
        return false
      }

      console.log('[DailyApiService] Room deleted successfully:', roomName)
      return true
    } catch (error) {
      console.error('[DailyApiService] Error deleting room:', error)
      return false
    }
  }

  /**
   * Create a meeting token for a room
   */
  async createMeetingToken(options: CreateTokenOptions): Promise<string | null> {
    if (!this.apiKey) {
      console.error('[DailyApiService] Cannot create token without API key')
      return null
    }

    try {
      const tokenData = {
        properties: {
          room_name: options.room_name,
          user_name: options.user_name || 'Guest',
          is_owner: options.is_owner ?? false,
          enable_recording: options.enable_recording ?? false,
          // Token expires in 1 hour by default
          exp: options.exp ?? Math.floor(Date.now() / 1000) + (60 * 60),
          lang: options.lang ?? 'ru'
        }
      }

      console.log('[DailyApiService] Creating meeting token for room:', options.room_name)

      const response = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(tokenData)
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('[DailyApiService] Failed to create token:', error)
        return null
      }

      const result = await response.json()
      console.log('[DailyApiService] Token created successfully')
      return result.token
    } catch (error) {
      console.error('[DailyApiService] Error creating token:', error)
      return null
    }
  }

  /**
   * Create or get a room for an interview session
   */
  async getOrCreateInterviewRoom(sessionId: string): Promise<{ room: DailyRoom; token: string } | null> {
    try {
      // Use session ID as part of room name for consistency
      const roomName = `interview-${sessionId}`
      
      // Try to get existing room first
      let room = await this.getRoom(roomName)
      
      // If room doesn't exist, create it
      if (!room) {
        room = await this.createRoom({
          name: roomName,
          privacy: 'public',
          properties: {
            enable_recording: false, // Can be enabled if needed
            enable_chat: true,
            enable_screenshare: true,
            max_participants: 2, // Candidate + AI
            exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60), // Expires in 2 hours
            lang: 'ru',
            enable_prejoin_ui: false,
            enable_network_ui: true,
            enable_people_ui: true
          }
        })
      }

      if (!room) {
        console.error('[DailyApiService] Failed to get or create room')
        return null
      }

      // Create a meeting token for the candidate
      const token = await this.createMeetingToken({
        room_name: room.name,
        user_name: 'Candidate',
        is_owner: false,
        enable_recording: false,
        exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60) // Token expires in 2 hours
      })

      if (!token) {
        console.error('[DailyApiService] Failed to create meeting token')
        return null
      }

      return { room, token }
    } catch (error) {
      console.error('[DailyApiService] Error in getOrCreateInterviewRoom:', error)
      return null
    }
  }
}

// Export a singleton instance
export const dailyApiService = new DailyApiService()