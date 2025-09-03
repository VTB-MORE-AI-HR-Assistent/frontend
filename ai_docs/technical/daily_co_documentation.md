# Daily.co Integration Documentation

## 🎯 Overview

Daily.co is a WebRTC platform-as-a-service that provides developers with APIs and infrastructure to integrate real-time video and audio calling into applications. For our AI HR Assistant project, Daily.co serves as the video communication backbone that enables seamless interaction between candidates and our AI interviewer bot.

## 🏆 Why We Chose Daily.co

### **Speed of Development**
- **10,000 free minutes/month** - Perfect for hackathon and MVP
- **Ready-to-use Pipecat framework** specifically designed for AI bots
- **2-3 hours integration time** vs weeks of custom WebRTC development
- **Comprehensive documentation** with AI bot examples

### **AI Bot Integration**
- **Native Pipecat support** - Open source framework for conversational AI
- **Built-in integration** with OpenAI, Whisper, ElevenLabs, Deepgram
- **Real-time audio streaming** with Voice Activity Detection
- **Automatic WebRTC handling** - no need to manage connections manually

### **Enterprise-Grade Reliability**
- **Global WebRTC infrastructure** since 2016
- **Authors of WebRTC standards** on their team
- **$60M+ in funding** - stable platform
- **Enterprise clients**: AppFolio, HotDoc, Pitch, Kumospace

### **Developer Experience**
- **Simple pricing model** - participant-minutes (not complex subscriber-minutes)
- **No credit card required** to start
- **Excellent documentation** and community support
- **Cross-platform SDKs** with consistent APIs

## 🏗 Architecture Overview

```
┌─────────────────┐    WebRTC     ┌──────────────┐    WebRTC    ┌─────────────────┐
│   Frontend      │◄─────────────►│ Daily Cloud  │◄─────────────►│   AI Bot        │
│   (Candidate)   │               │ (Infrastructure) │           │ (Python/Pipecat)│
└─────────────────┘               └──────────────┘              └─────────────────┘
        │                                ▲                              ▲
        │ HTTP/REST                      │ REST API                     │
        ▼                                ▼                              │
┌─────────────────┐               ┌──────────────┐                     │
│   Backend       │               │  Daily API   │                     │
│   (Kotlin)      │──────────────►│ (Room/Token  │─────────────────────┘
└─────────────────┘   HTTP        │  Management) │        HTTP
```

### **Data Flow**
1. **Candidate speaks** → WebRTC stream → Daily Cloud
2. **Daily Cloud** routes audio → AI Bot (Python)
3. **AI Bot processes** (STT → GPT → TTS)
4. **AI Bot responds** → Daily Cloud → Candidate hears response

### **Key Components**
- **Frontend**: Daily.js SDK for candidate UI
- **Backend**: Daily REST API for room/token management
- **ML Service**: Pipecat + Daily Python SDK for AI bot
- **Daily Cloud**: Handles all WebRTC complexity

## 🛠 Implementation Guide

### **1. Frontend Integration**

```javascript
// Install Daily.js SDK
npm install @daily-co/daily-js

// Basic integration
import DailyIframe from '@daily-co/daily-js'

export default function InterviewPage({ roomUrl, token }) {
  const [callFrame, setCallFrame] = useState(null)
  
  useEffect(() => {
    const frame = DailyIframe.createFrame({
      showLeaveButton: true,
      showFullscreenButton: false,
      showChatButton: false
    })
    
    frame.join({ url: roomUrl, token: token })
    setCallFrame(frame)
  }, [roomUrl, token])

  return (
    <div className="interview-container">
      <div id="daily-iframe" />
      <InterviewStatus />
    </div>
  )
}
```

### **2. Backend Integration**

```kotlin
// Add Daily API client
@Service
class DailyService {
    private val apiKey = "YOUR_DAILY_API_KEY"
    private val baseUrl = "https://api.daily.co/v1"
    
    fun createRoom(name: String): DailyRoom {
        val request = CreateRoomRequest(
            name = name,
            privacy = "private",
            properties = RoomProperties(
                max_participants = 2,
                enable_recording = true,
                exp = System.currentTimeMillis() + TimeUnit.HOURS.toMillis(2)
            )
        )
        
        return restTemplate.postForObject(
            "$baseUrl/rooms",
            HttpEntity(request, createHeaders()),
            DailyRoom::class.java
        )!!
    }
    
    fun createToken(roomName: String, userName: String, isOwner: Boolean): String {
        val request = CreateTokenRequest(
            room_name = roomName,
            user_name = userName,
            is_owner = isOwner
        )
        
        val response = restTemplate.postForObject(
            "$baseUrl/meeting-tokens",
            HttpEntity(request, createHeaders()),
            TokenResponse::class.java
        )
        
        return response!!.token
    }
    
    private fun createHeaders(): HttpHeaders {
        val headers = HttpHeaders()
        headers.setBearerAuth(apiKey)
        headers.contentType = MediaType.APPLICATION_JSON
        return headers
    }
}
```

### **3. AI Bot Integration**

```python
# Install Pipecat
pip install pipecat-ai

# AI Interviewer Implementation
import asyncio
from pipecat.pipeline.runner import PipelineRunner
from pipecat.processors.speech import DeepgramSTTProcessor
from pipecat.processors.llm import OpenAILLMProcessor
from pipecat.processors.tts import ElevenLabsTTSProcessor
from pipecat.transports.daily import DailyTransport

class AIInterviewer:
    def __init__(self, candidate_id: int):
        self.candidate_id = candidate_id
        self.interview_context = self._load_context()
    
    async def start_interview(self, room_url: str, bot_token: str):
        # Connect to Daily room
        transport = DailyTransport(
            room_url=room_url,
            token=bot_token,
            bot_name="AI Interviewer",
            mic_enabled=True,
            camera_enabled=False
        )
        
        # Create AI pipeline
        stt = DeepgramSTTProcessor(
            api_key=os.getenv("DEEPGRAM_API_KEY")
        )
        
        llm = OpenAILLMProcessor(
            api_key=os.getenv("OPENAI_API_KEY"),
            model="gpt-4",
            system_prompt=self._create_hr_prompt()
        )
        
        tts = ElevenLabsTTSProcessor(
            api_key=os.getenv("ELEVENLABS_API_KEY"),
            voice_id="professional_voice"
        )
        
        # Build pipeline
        pipeline = [
            transport.audio_in,
            stt,
            llm, 
            tts,
            transport.audio_out
        ]
        
        # Run interview
        runner = PipelineRunner(pipeline, transport)
        await runner.run()
    
    def _create_hr_prompt(self) -> str:
        return f"""You are an experienced HR specialist conducting a technical interview.
        
        Candidate Info: {self.interview_context['candidate']}
        Job Requirements: {self.interview_context['job']}
        
        Instructions:
        1. Ask relevant technical questions based on the job requirements
        2. Listen to candidate responses and ask follow-up questions
        3. Be professional and encouraging
        4. Conduct a natural conversation, not an interrogation
        5. Interview should last 20-30 minutes total
        
        Start by greeting the candidate and explaining the interview process.
        """

# Main entry point
async def main():
    room_url = sys.argv[1]
    bot_token = sys.argv[2] 
    candidate_id = int(sys.argv[3])
    
    interviewer = AIInterviewer(candidate_id)
    await interviewer.start_interview(room_url, bot_token)

if __name__ == "__main__":
    asyncio.run(main())
```

### **4. Complete Workflow**

```kotlin
// Backend API endpoint
@PostMapping("/api/interviews/{candidateId}/start")
fun startInterview(@PathVariable candidateId: Long): InterviewResponse {
    
    // 1. Validate candidate and job
    val candidate = candidateService.findById(candidateId)
    val job = jobService.findByCandidate(candidate)
    
    // 2. Create Daily room
    val roomName = "interview-${candidateId}-${System.currentTimeMillis()}"
    val room = dailyService.createRoom(roomName)
    
    // 3. Generate tokens
    val candidateToken = dailyService.createToken(room.name, "candidate-$candidateId", false)
    val botToken = dailyService.createToken(room.name, "ai-interviewer", true)
    
    // 4. Start AI bot process
    val botProcess = ProcessBuilder(
        "python", "ai_bot.py", 
        room.url, botToken, candidateId.toString()
    ).start()
    
    // 5. Save interview record
    val interview = interviewRepository.save(
        Interview(
            candidateId = candidateId,
            jobId = job.id,
            roomUrl = room.url,
            status = InterviewStatus.STARTED
        )
    )
    
    return InterviewResponse(
        interviewId = interview.id,
        roomUrl = room.url,
        candidateToken = candidateToken
    )
}
```

## 💰 Pricing & Limits

### **Free Tier**
- **10,000 participant-minutes/month**
- Up to 20 participants per call
- 50 programmatic rooms (10,000 with credit card)
- Email and chat support
- No credit card required to start

### **Paid Pricing**
- **Video calls**: $0.004/participant-minute
- **Audio-only**: $0.00099/participant-minute  
- **Recording**: $0.01349/minute
- **Volume discounts** available automatically

### **Hackathon Usage Estimate**
- 20-minute interview × 2 participants = 40 participant-minutes
- 100 test interviews = 4,000 minutes
- **Well within free tier limits!**

## 🚀 Getting Started

### **1. Setup Daily.co Account**
```bash
# Sign up at https://daily.co
# Get API key from dashboard
export DAILY_API_KEY="your_api_key_here"
```

### **2. Environment Variables**
```bash
# .env file
DAILY_API_KEY=your_daily_api_key
OPENAI_API_KEY=your_openai_key  
DEEPGRAM_API_KEY=your_deepgram_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

### **3. Test Integration**
```javascript
// Quick test in browser console
const daily = DailyIframe.createFrame()
daily.join({ url: 'https://your-domain.daily.co/test-room' })
```

## 🔧 Advanced Configuration

### **Room Properties**
```javascript
const roomConfig = {
  privacy: "private",           // private | public
  max_participants: 2,          // Maximum participants
  enable_recording: true,       // Auto-recording
  enable_chat: false,          // Disable chat for focus
  enable_screenshare: false,   // Not needed for audio interview
  exp: Date.now() + 7200000,   // 2-hour expiration
  lang: "en",                  // Interface language
  start_audio_off: false,      // Start with audio on
  start_video_off: true        // Start with video off (audio-only)
}
```

### **Token Permissions**
```javascript
const tokenConfig = {
  room_name: "interview-123",
  user_name: "candidate-456", 
  is_owner: false,             // Limited permissions
  exp: Date.now() + 7200000,   // 2-hour expiration
  enable_recording: false,     // Candidate cannot record
  start_audio_off: false,
  start_video_off: true
}
```

### **Webhook Setup**
```kotlin
// Receive Daily.co events
@PostMapping("/webhooks/daily")
fun handleDailyWebhook(@RequestBody event: DailyWebhookEvent) {
    when (event.type) {
        "meeting.started" -> handleMeetingStarted(event)
        "meeting.ended" -> handleMeetingEnded(event) 
        "recording.ready" -> handleRecordingReady(event)
        "participant.joined" -> handleParticipantJoined(event)
        "participant.left" -> handleParticipantLeft(event)
    }
}
```

## 🔍 Monitoring & Debugging

### **Daily.co Analytics**
- Real-time call quality metrics
- Participant connection logs  
- Audio/video quality data
- Network performance insights

### **Debug Tools**
```javascript
// Enable Daily.js debug logs
daily.setDailyLang('en')
daily.setUserName('debug-user')

// Listen to events
daily.on('participant-joined', (event) => {
  console.log('Participant joined:', event.participant)
})

daily.on('participant-left', (event) => {
  console.log('Participant left:', event.participant)
})

daily.on('error', (event) => {
  console.error('Daily.co error:', event.error)
})
```

## 🛡 Security Considerations

### **Token Security**
- ✅ Generate tokens on backend only
- ✅ Use short expiration times (2-4 hours)
- ✅ Limit permissions per participant type
- ✅ Never expose API keys in frontend

### **Room Security**
- ✅ Use private rooms only
- ✅ Implement room cleanup after interviews
- ✅ Enable recording for audit purposes
- ✅ Monitor participant activity

## 📚 Additional Resources

### **Documentation**
- [Daily.co API Docs](https://docs.daily.co/)
- [Pipecat Framework](https://docs.pipecat.ai/)
- [Daily.js SDK Reference](https://docs.daily.co/reference/daily-js)

### **Examples**
- [AI Bot Examples](https://github.com/pipecat-ai/pipecat/tree/main/examples/daily)
- [Daily.co Demo Apps](https://github.com/daily-demos)
- [React Integration Guide](https://docs.daily.co/guides/products/client-sdk/react)

### **Support**
- **Community**: [Daily.co Discord](https://discord.gg/daily)
- **Documentation**: help@daily.co
- **Status Page**: [status.daily.co](https://status.daily.co)

## 🎯 Success Metrics

### **For Hackathon**
- ✅ Working demo in 2-3 days
- ✅ Stable audio quality  
- ✅ Real-time AI responses
- ✅ Professional presentation

### **For Production**
- Call completion rate > 95%
- Audio quality score > 4.0/5
- Average response latency < 2s
- Cost per interview < $0.50

---

*This documentation covers everything needed to integrate Daily.co into our AI HR Assistant project. The platform's developer-first approach and AI bot framework make it the perfect choice for rapid prototyping and production deployment.*