# Daily.co Frontend Implementation Plan

## 📅 Date: 2025-01-09

## 🎯 Project Goal
Implement audio-only interview functionality with Daily.co for VTB AI HR Assistant, featuring custom UI with VTB branding, showing both participants (candidate and AI interviewer).

## 📋 Requirements Summary
- **Mode**: Audio-only interviews (no video)
- **Access**: Via email link sent to candidates
- **UI**: Custom VTB-branded interface (not iframe)
- **Participants**: Show both candidate and AI interviewer
- **Features**: No chat functionality
- **Branding**: VTB blue (#1B4F8C) consistent theme

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Email Link → Interview Page → Daily.co Connection → Audio Call │
│                                                                  │
│  Components:                                                     │
│  - InterviewPage (main container)                               │
│  - AudioInterview (Daily.co integration)                        │
│  - ParticipantCard (candidate/AI display)                       │
│  - InterviewControls (mute, leave, etc.)                        │
│  - InterviewStatus (connection state)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Implementation Plan

### Phase 1: Setup & Dependencies (Day 1 - Morning)

#### Step 1.1: Install Daily.co Dependencies
```bash
npm install @daily-co/daily-js @daily-co/daily-react
```

#### Step 1.2: Add TypeScript Types
```bash
npm install --save-dev @types/daily-co__daily-js
```

#### Step 1.3: Environment Variables Setup
Add to `.env.local`:
```
NEXT_PUBLIC_DAILY_DOMAIN=https://vtbaihr.daily.co
NEXT_PUBLIC_DAILY_API_KEY=your_api_key_here
```

#### Step 1.4: Create Folder Structure
```
src/
├── app/
│   └── interview/
│       └── [sessionId]/
│           ├── page.tsx           # Interview page
│           └── loading.tsx        # Loading state
├── components/
│   └── interview/
│       ├── audio-interview.tsx    # Main Daily.co component
│       ├── participant-card.tsx   # Participant display
│       ├── interview-controls.tsx # Control buttons
│       ├── interview-status.tsx   # Connection status
│       └── interview-ended.tsx    # End screen
└── lib/
    └── api/
        └── interview.ts           # Interview API service
```

---

### Phase 2: Core Components Development (Day 1 - Afternoon)

#### Step 2.1: Interview Page Route
**File**: `src/app/interview/[sessionId]/page.tsx`

Key Features:
- Extract sessionId and token from URL params
- Validate interview access
- Show loading state while connecting
- Handle expired/invalid links

#### Step 2.2: Audio Interview Component
**File**: `src/components/interview/audio-interview.tsx`

Core Functionality:
- Initialize Daily.co call object
- Join room with token
- Track participant states
- Handle audio streams
- Manage connection lifecycle

#### Step 2.3: Participant Card Component
**File**: `src/components/interview/participant-card.tsx`

Display Elements:
- Participant avatar (initials or AI icon)
- Name label
- Audio level indicator
- Speaking indicator animation
- Connection status badge

#### Step 2.4: Interview Controls Component
**File**: `src/components/interview/interview-controls.tsx`

Controls:
- Mute/unmute microphone
- Leave interview button
- Audio settings (optional)
- Connection quality indicator

---

### Phase 3: Custom UI Implementation (Day 2 - Morning)

#### Step 3.1: VTB Branded Layout
Design Elements:
- VTB blue header with logo
- Clean white background
- Card-based participant display
- Professional color scheme

Layout Structure:
```
┌─────────────────────────────────────────────────────────┐
│  [VTB Logo]  AI HR Interview Session         [Timer]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│    ┌──────────────┐        ┌──────────────┐            │
│    │              │        │              │            │
│    │   Candidate  │        │      AI      │            │
│    │   [Avatar]   │        │   [AI Icon]  │            │
│    │              │        │              │            │
│    │  ~~~ ~~~ ~~~ │        │  ~~~ ~~~ ~~~ │            │
│    └──────────────┘        └──────────────┘            │
│                                                          │
│         [🎤 Mute]    [📞 End Interview]                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Step 3.2: Audio Visualization
- Real-time audio level bars
- Speaking indicator (pulsing border)
- Voice activity detection
- Smooth animations

#### Step 3.3: Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop full-screen mode
- Landscape/portrait handling

---

### Phase 4: API Integration (Day 2 - Afternoon)

#### Step 4.1: Interview API Service
**File**: `src/lib/api/interview.ts`

API Endpoints:
```typescript
// Validate interview session
GET /api/interviews/validate/:sessionId

// Get interview details
GET /api/interviews/:sessionId

// Start interview (join room)
POST /api/interviews/:sessionId/join

// End interview
POST /api/interviews/:sessionId/end

// Report technical issue
POST /api/interviews/:sessionId/report-issue
```

#### Step 4.2: Error Handling
Error Scenarios:
- Invalid/expired session
- Network connection issues
- Microphone permission denied
- Browser incompatibility
- AI bot not responding

#### Step 4.3: State Management
States to Track:
- Connection status (connecting, connected, error, ended)
- Audio status (muted, unmuted, speaking)
- Participant list (candidate, AI bot)
- Interview timer
- Error states

---

### Phase 5: Email Link Flow (Day 3 - Morning)

#### Step 5.1: Link Generation
Backend provides link format:
```
https://app.vtbaihr.com/interview/[sessionId]?token=[jwt_token]
```

#### Step 5.2: Link Validation Flow
1. Extract sessionId and token from URL
2. Validate with backend API
3. Check interview scheduled time
4. Verify candidate identity
5. Join Daily.co room

#### Step 5.3: Pre-Interview Setup
**File**: `src/components/interview/pre-interview-check.tsx`

Checks:
- Browser compatibility
- Microphone permission
- Audio test
- Connection speed test
- Ready confirmation

---

### Phase 6: User Experience Enhancements (Day 3 - Afternoon)

#### Step 6.1: Loading States
- Connecting to interview animation
- AI bot joining indicator
- Reconnection attempts
- Timeout handling

#### Step 6.2: Interview End Flow
Post-Interview Screen:
- Thank you message
- Next steps information
- Feedback option
- Return to main site button

#### Step 6.3: Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Audio cues for events

#### Step 6.4: Notifications
Browser Notifications for:
- AI bot joined
- Connection issues
- Interview ending soon
- Interview completed

---

### Phase 7: Testing & Quality Assurance (Day 4)

#### Step 7.1: Component Testing
- Unit tests for utilities
- Component rendering tests
- Event handler testing
- State management tests

#### Step 7.2: Integration Testing
- API communication
- Daily.co connection flow
- Error scenario handling
- Cross-browser testing

#### Step 7.3: User Acceptance Testing
Test Scenarios:
1. Join via email link
2. Complete audio test
3. Conduct 5-minute interview
4. Handle disconnection
5. Rejoin capability
6. Normal interview end

#### Step 7.4: Performance Testing
Metrics:
- Page load time < 2s
- Connection time < 3s
- Audio latency < 200ms
- CPU usage < 30%

---

## 🔧 Technical Implementation Details

### Daily.co Call Object Configuration
```javascript
const callObject = DailyIframe.createCallObject({
  audioSource: true,
  videoSource: false,  // Audio only
  dailyConfig: {
    experimentalChromeVideoMuteLightOff: true,
    customIntegrations: {
      appName: 'VTB AI HR Assistant',
      appVersion: '1.0.0'
    }
  }
});
```

### Custom Event Handlers
```javascript
// Participant events
'participant-joined'    // AI bot or candidate joined
'participant-updated'   // Audio state changed
'participant-left'      // Someone left

// Audio events
'track-started'         // Audio track available
'track-stopped'         // Audio track ended
'active-speaker-change' // Speaking indicator

// Connection events
'joined-meeting'        // Successfully joined
'left-meeting'          // Left the room
'error'                 // Connection error
```

### Audio Visualization Library Options
1. **Web Audio API** (native, recommended)
2. **wavesurfer.js** (if complex visualization needed)
3. **Custom Canvas** implementation

---

## 🎨 UI/UX Specifications

### Color Palette
```css
--vtb-primary: #1B4F8C;
--vtb-primary-dark: #143A66;
--vtb-primary-light: #2563EB;
--audio-active: #10B981;
--audio-muted: #EF4444;
--background: #F8FAFC;
--card-bg: #FFFFFF;
```

### Typography
```css
--font-primary: 'Inter', system-ui, sans-serif;
--font-size-title: 24px;
--font-size-body: 16px;
--font-size-label: 14px;
```

### Animation Timings
```css
--animation-fast: 150ms;
--animation-normal: 300ms;
--animation-slow: 500ms;
```

---

## 🚧 Potential Challenges & Solutions

### Challenge 1: Browser Microphone Permissions
**Solution**: Clear permission request UI with instructions and troubleshooting guide

### Challenge 2: Network Quality Issues
**Solution**: Implement adaptive bitrate, show connection quality indicator, auto-reconnect

### Challenge 3: AI Bot Not Joining
**Solution**: Timeout after 30s, show retry option, fallback to schedule later

### Challenge 4: Mobile Browser Limitations
**Solution**: Detect mobile, optimize UI, provide app download option if needed

---

## 📊 Success Metrics

### Technical Metrics
- Connection success rate > 95%
- Audio quality score > 4/5
- Average setup time < 30 seconds
- Error rate < 2%

### User Experience Metrics
- Interview completion rate > 90%
- Audio test pass rate > 98%
- User satisfaction > 4.5/5
- Support tickets < 5%

---

## 🔄 Rollback Plan

If Daily.co integration fails:
1. **Immediate**: Disable interview links, show maintenance message
2. **Short-term**: Implement simple Jitsi Meet iframe as backup
3. **Long-term**: Evaluate alternative solutions (Agora, Whereby)

---

## 📚 Resources & References

### Documentation
- [Daily.co React Docs](https://docs.daily.co/guides/products/react)
- [Daily.co Call Object](https://docs.daily.co/reference/daily-js/factory-methods/create-call-object)
- [Daily.co Events](https://docs.daily.co/reference/daily-js/events)

### Example Repositories
- [Daily.co React Demo](https://github.com/daily-demos/call-object-react)
- [Audio-Only Example](https://github.com/daily-demos/audio-only-demo)

### Support Contacts
- Daily.co Support: help@daily.co
- Daily.co Discord: https://discord.gg/daily

---

## ✅ Definition of Done

The feature is complete when:
1. ✅ Candidate can join via email link
2. ✅ Audio connection established with AI bot
3. ✅ Custom VTB branded UI displays both participants
4. ✅ Microphone controls work properly
5. ✅ Interview can be ended by either party
6. ✅ Error handling covers all scenarios
7. ✅ Mobile responsive design works
8. ✅ Accessibility standards met
9. ✅ Performance metrics achieved
10. ✅ Documentation completed

---

## 🎯 Next Steps After Implementation

1. **Monitor & Iterate**: Track metrics, gather feedback
2. **Add Features**: Recording, transcription, video mode
3. **Scale Infrastructure**: Load testing, CDN setup
4. **Enhance AI Bot**: Better responses, multiple languages
5. **Analytics Integration**: Track interview metrics

---

*This implementation plan provides a complete roadmap for integrating Daily.co audio interviews into the VTB AI HR Assistant frontend. The modular approach allows for incremental development and testing.*