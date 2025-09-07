const WebSocket = require('ws');

// Create WebSocket server on port 8000
const wss = new WebSocket.Server({ port: 8000 });

console.log('🚀 Mock WebSocket Server running on ws://localhost:8000/ws');

wss.on('connection', (ws) => {
  console.log('📱 New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data.type);

      if (data.type === 'session_start') {
        console.log(`🎯 Session started: ${data.sessionId} for ${data.candidateName}`);
        
        // Send welcome message
        ws.send(JSON.stringify({
          type: 'audio',
          text: `Hello ${data.candidateName}! Welcome to your VTB interview. I'm your AI interviewer. Please tell me about yourself.`,
          data: null // No audio in mock
        }));
      }

      if (data.type === 'audio') {
        console.log('🎤 Audio received, sending mock response...');
        
        // Simulate transcription
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'transcription',
            text: 'Thank you for your response. I understand you have experience in frontend development.'
          }));
        }, 500);

        // Simulate AI response
        setTimeout(() => {
          const responses = [
            "That's interesting! Can you tell me more about your experience with React and TypeScript?",
            "Great! What challenges have you faced in your previous projects?",
            "Excellent! How do you handle state management in large applications?",
            "Perfect! What's your approach to testing frontend applications?",
            "Wonderful! How do you ensure code quality in your team?"
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          ws.send(JSON.stringify({
            type: 'audio',
            text: randomResponse,
            data: null // No audio in mock
          }));
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process your message'
      }));
    }
  });

  ws.on('close', () => {
    console.log('📱 Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

console.log('💡 To test:');
console.log('1. Run: npm run dev (in another terminal)');
console.log('2. Open: http://localhost:3000/interview/test-session-123?token=test');
console.log('3. Click "Start Recording" and speak into microphone');
