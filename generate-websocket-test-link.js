// Simple test link generator without JWT tokens

const sessionId = 'test-session-123'

console.log('🎯 Simple WebSocket Test Interview Link Generated!')
console.log('')
console.log('📋 Interview Details:')
console.log(`   Session ID: ${sessionId}`)
console.log(`   No authentication required`)
console.log('')
console.log('🔗 Simple Test Interview URL:')
console.log(`http://localhost:3000/interview/${sessionId}`)
console.log('')
console.log('🧪 Testing Instructions:')
console.log('1. Start mock WebSocket server: node mock-websocket-server.js')
console.log('2. Start Next.js dev server: npm run dev')
console.log('3. Open the URL above in your browser')
console.log('4. Allow microphone permission')
console.log('5. Click "Start Recording" and speak')
console.log('')
console.log('📝 Direct URL for testing:')
console.log(`http://localhost:3000/interview/${sessionId}`)
