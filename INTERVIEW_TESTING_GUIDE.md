# Daily.co Interview Testing Guide

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the Test Generator
Open your browser and navigate to:
```
http://localhost:3000/test-interview
```

### 3. Generate a Test Link
1. Fill in the candidate details (or use defaults)
2. Choose when the interview should be scheduled:
   - **Immediate Interview** (0 minutes) - Join right away
   - **In 5 minutes** - Test pre-interview window
   - **In 15 minutes** - Test scheduled window access
   - **In 1 hour** - Test "too early" scenario
3. Click **"Generate Test Link"**
4. Click **"Open in New Tab"** to test the interview flow

## 📋 Test Scenarios

### ✅ Scenario 1: Immediate Interview
- Set "Schedule In" to **0 minutes**
- Expected: Should proceed directly to interview after identity verification

### ✅ Scenario 2: Pre-Interview Window
- Set "Schedule In" to **10 minutes**
- Expected: Should allow joining (15-minute pre-interview window)

### ✅ Scenario 3: Too Early Access
- Set "Schedule In" to **30+ minutes**
- Expected: Should show "Interview Not Yet Available" screen with countdown

### ✅ Scenario 4: Identity Verification
- Any valid link
- Expected: Should show identity verification screen before starting

### ✅ Scenario 5: Pre-Interview Checks
- After identity verification
- Expected: Should run system checks (browser, network, microphone, audio)

### ✅ Scenario 6: Error States
- Modify the URL to use invalid session ID
- Expected: Should show appropriate error messages

## 🔍 What to Test

### Interview Flow
1. **Link Validation**: Token and session validation
2. **Schedule Verification**: Time window checking
3. **Identity Verification**: Candidate confirmation
4. **Pre-Interview Checks**:
   - Browser compatibility
   - Network connection
   - Microphone access
   - Audio level test
5. **Loading States**: Various loading animations
6. **Error Recovery**: Connection loss handling
7. **Interview End**: Thank you screen and feedback

### UI/UX Features
- **Responsive Design**: Test on different screen sizes
- **Accessibility**: Try keyboard navigation (Tab, Enter, Escape)
- **Notifications**: Browser notifications (if enabled)
- **Animations**: Loading states and transitions
- **VTB Branding**: Consistent blue theme (#1B4F8C)

## ⚠️ Important Notes

### Mock Implementation
- This is a **mock implementation** for UI testing
- Daily.co video/audio won't work without real credentials
- All API calls use mock data with simulated delays
- Sessions are stored in memory (refresh clears them)

### What Works
✅ Complete UI flow  
✅ All error states  
✅ Loading animations  
✅ Schedule validation  
✅ Identity verification  
✅ System checks UI  
✅ Thank you/feedback screens  
✅ Accessibility features  

### What Doesn't Work (Needs Real Backend)
❌ Actual WebRTC audio/video  
❌ Real Daily.co rooms  
❌ Database persistence  
❌ Email sending  
❌ Real JWT signing  
❌ AI bot joining  

## 🛠️ Customization

### Test Different Scenarios
In the test generator, you can customize:
- **Candidate Name**: Test with different names
- **Email**: Test email validation
- **Position**: Different job titles
- **Duration**: Interview length (5-120 minutes)
- **Session ID**: Unique identifiers
- **Schedule Time**: Various time windows

### Keyboard Shortcuts (During Interview)
- `M` - Toggle microphone
- `Ctrl+E` - End interview
- `?` - Show help
- `Alt+C` - Focus controls

## 📊 Test Data

### Generated Link Format
```
http://localhost:3000/interview/[sessionId]?token=[JWT_TOKEN]
```

### Token Expiry
- Links expire after **48 hours**
- Interview window: **15 minutes before** to **60 minutes after** scheduled time

### Mock Delays
- API calls: ~800ms
- Validation: ~100ms
- Connection: ~2s

## 🐛 Troubleshooting

### Link Not Working?
1. Make sure dev server is running
2. Check browser console for errors
3. Try generating a new link
4. Clear browser cache if needed

### Microphone Permission Issues?
1. Check browser settings
2. Allow microphone access when prompted
3. Try incognito/private mode

### Page Not Loading?
1. Check if port 3000 is available
2. Restart dev server
3. Check for TypeScript errors

## 📝 Feedback

Testing the interview flow? Here's what to look for:
- Smooth transitions between states
- Clear error messages
- Intuitive navigation
- Professional appearance
- Accessibility compliance
- Performance (should feel snappy)

## 🔗 Related Files

- **Test Generator**: `/src/app/test-interview/page.tsx`
- **Interview Page**: `/src/app/interview/[sessionId]/page.tsx`
- **Email Service**: `/src/lib/interview/email-link-service.ts`
- **API Mock**: `/src/lib/api/interview.ts`
- **Components**: `/src/components/interview/`
- **Documentation**: `/ai_docs/documentation/dailyco/`