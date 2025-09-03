// API route for creating Daily.co rooms
import { NextRequest, NextResponse } from 'next/server'
import { dailyApiService } from '@/lib/daily/daily-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, candidateName, duration } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Create or get the interview room
    const result = await dailyApiService.getOrCreateInterviewRoom(sessionId)

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create Daily.co room' },
        { status: 500 }
      )
    }

    // Return room credentials
    return NextResponse.json({
      success: true,
      roomUrl: result.room.url,
      roomName: result.room.name,
      token: result.token,
      expiresAt: new Date(result.room.properties?.exp ? result.room.properties.exp * 1000 : Date.now() + 7200000),
      enableRecording: result.room.properties?.enable_recording || false,
      maxDuration: duration || 30
    })
  } catch (error) {
    console.error('[API] Error creating Daily.co room:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get room details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomName = searchParams.get('roomName')

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    const room = await dailyApiService.getRoom(roomName)

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      room
    })
  } catch (error) {
    console.error('[API] Error getting Daily.co room:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete room
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomName = searchParams.get('roomName')

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    const success = await dailyApiService.deleteRoom(roomName)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete room' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully'
    })
  } catch (error) {
    console.error('[API] Error deleting Daily.co room:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}