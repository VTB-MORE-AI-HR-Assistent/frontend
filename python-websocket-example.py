#!/usr/bin/env python3
"""
Example Python WebSocket server for VTB AI HR Assistant
Handles audio streaming and AI conversation
"""

import asyncio
import websockets
import json
import base64
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InterviewServer:
    def __init__(self):
        self.active_sessions = {}
    
    async def handle_client(self, websocket, path):
        client_id = f"{websocket.remote_address[0]}:{websocket.remote_address[1]}"
        logger.info(f"🔗 Client connected: {client_id}")
        
        try:
            async for message in websocket:
                await self.process_message(websocket, message, client_id)
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"📱 Client disconnected: {client_id}")
        except Exception as e:
            logger.error(f"❌ Error handling client {client_id}: {e}")
    
    async def process_message(self, websocket, message, client_id):
        try:
            data = json.loads(message)
            message_type = data.get('type')
            
            if message_type == 'session_start':
                await self.handle_session_start(websocket, data, client_id)
            elif message_type == 'audio':
                await self.handle_audio(websocket, data, client_id)
            else:
                logger.warning(f"⚠️ Unknown message type: {message_type}")
                
        except json.JSONDecodeError:
            logger.error(f"❌ Invalid JSON from {client_id}")
            await websocket.send(json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def handle_session_start(self, websocket, data, client_id):
        session_id = data.get('sessionId')
        candidate_name = data.get('candidateName', 'Candidate')
        
        logger.info(f"🎯 Session started: {session_id} for {candidate_name}")
        
        # Store session info
        self.active_sessions[client_id] = {
            'session_id': session_id,
            'candidate_name': candidate_name,
            'start_time': datetime.now(),
            'message_count': 0
        }
        
        # Send welcome message
        welcome_message = f"Hello {candidate_name}! Welcome to your VTB interview. I'm your AI interviewer. Please tell me about yourself and your experience."
        
        await websocket.send(json.dumps({
            'type': 'audio',
            'text': welcome_message,
            'data': None  # No audio in this example
        }))
    
    async def handle_audio(self, websocket, data, client_id):
        session = self.active_sessions.get(client_id)
        if not session:
            logger.warning(f"⚠️ No session found for {client_id}")
            return
        
        # Get audio data
        audio_data = data.get('data')  # Base64 encoded WebM audio
        session_id = data.get('sessionId')
        
        logger.info(f"🎤 Received audio from {session['candidate_name']} (Session: {session_id})")
        logger.info(f"📊 Audio data length: {len(audio_data) if audio_data else 0} characters")
        
        # Increment message count
        session['message_count'] += 1
        
        # Simulate transcription (you would use Whisper STT here)
        await asyncio.sleep(0.5)
        await websocket.send(json.dumps({
            'type': 'transcription',
            'text': f"[Transcription {session['message_count']}] Thank you for your response about your background and experience."
        }))
        
        # Simulate AI processing and response (you would use GPT-4 here)
        await asyncio.sleep(1.5)
        
        # Generate contextual responses
        responses = [
            "That's very interesting! Can you tell me more about your experience with React and TypeScript?",
            "Great background! What challenges have you faced in your previous frontend projects?",
            "Excellent! How do you approach state management in large React applications?",
            "Perfect! What's your experience with testing frontend applications?",
            "Wonderful! How do you ensure code quality and maintainability in your projects?",
            "That's impressive! Can you describe a complex technical problem you've solved recently?",
            "Great insights! How do you stay updated with the latest frontend technologies?",
            "Excellent! What's your approach to optimizing web application performance?"
        ]
        
        response_text = responses[min(session['message_count'] - 1, len(responses) - 1)]
        
        await websocket.send(json.dumps({
            'type': 'audio',
            'text': response_text,
            'data': None  # You would generate TTS audio here
        }))
        
        logger.info(f"🤖 Sent AI response to {session['candidate_name']}")

async def main():
    server = InterviewServer()
    
    logger.info("🚀 Starting VTB AI Interview WebSocket Server...")
    logger.info("📡 Server will run on ws://localhost:8000/ws")
    logger.info("🎯 Ready to handle interview sessions!")
    
    # Start WebSocket server
    start_server = websockets.serve(
        server.handle_client,
        "localhost",
        8000,
        subprotocols=["ws"]
    )
    
    await start_server
    logger.info("✅ Server started successfully!")
    
    # Keep server running
    await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server error: {e}")
