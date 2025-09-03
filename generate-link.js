// Simple link generator for testing
const crypto = require('crypto');

// Generate mock JWT token
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const data = Buffer.from(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + (48 * 60 * 60 * 1000) // 48 hours
  })).toString('base64');
  const signature = crypto.randomBytes(32).toString('base64');
  return `${header}.${data}.${signature}`;
}

// Generate interview data
const sessionId = `interview-${Date.now()}`;
const interviewDate = new Date();
interviewDate.setMinutes(interviewDate.getMinutes() + 5); // Interview in 5 minutes

const tokenPayload = {
  sessionId: sessionId,
  candidateEmail: 'alexander.ivanov@gmail.com',
  candidateName: 'Александр Иванов',
  interviewDate: interviewDate.toISOString(),
  position: 'Senior Frontend Developer',
  type: 'interview_invitation'
};

const token = generateToken(tokenPayload);
const baseUrl = 'http://localhost:3000';
const link = `${baseUrl}/interview/${sessionId}?token=${encodeURIComponent(token)}`;

console.log('\n===========================================');
console.log('INTERVIEW LINK FOR USER TESTING');
console.log('===========================================\n');
console.log('Direct Interview Link (copy and paste in browser):');
console.log('\n' + link + '\n');
console.log('===========================================');
console.log('\nAlternatively, for the FULL realistic experience:');
console.log('1. Go to: http://localhost:3000');
console.log('2. Click "Open Gmail Inbox"');
console.log('3. Click the interview button in the email');
console.log('\n===========================================\n');