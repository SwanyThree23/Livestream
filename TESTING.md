# SwanyThree Ultimate - Testing & Verification Guide

This document provides comprehensive testing procedures to ensure SwanyThree Ultimate is working correctly.

## 🎯 Quick Verification Checklist

Run through this checklist after setup:

### Backend
- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] Database connection successful
- [ ] Winston logging working
- [ ] WebSocket server running

### Frontend
- [ ] Application loads without errors
- [ ] No console errors
- [ ] Tailwind CSS applied correctly
- [ ] Responsive on mobile
- [ ] Dark mode toggle works (if implemented)

### Integration
- [ ] API calls successful
- [ ] WebSocket connection establishes
- [ ] Authentication flow works
- [ ] Real-time updates functioning

---

## 🔍 Detailed Testing Procedures

### 1. Backend API Testing

#### 1.1 Health Check
```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-09T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

#### 1.2 Authentication Endpoints

**Register New User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123"
  }'
```

**Expected:** Status 201, returns user and JWT token

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Expected:** Status 200, returns user and JWT token

**Get Current User:**
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Status 200, returns user profile

#### 1.3 Streams Endpoints

**List Streams:**
```bash
curl http://localhost:3001/api/streams \
  -H "Authorization: Bearer $TOKEN"
```

**Create Stream:**
```bash
curl -X POST http://localhost:3001/api/streams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Stream",
    "description": "Testing stream creation",
    "platforms": ["twitch", "youtube"]
  }'
```

**Expected:** Status 201, returns stream object

#### 1.4 AI Endpoints

**Generate Podcast:**
```bash
curl -X POST http://localhost:3001/api/ai/podcast/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Testing AI Features",
    "duration": "5",
    "tone": "casual",
    "speakers": "2"
  }'
```

**Expected:** Status 200, returns generated script

⚠️ **Note:** Requires valid ANTHROPIC_API_KEY

#### 1.5 Error Handling

**Test 401 Unauthorized:**
```bash
curl http://localhost:3001/api/auth/me
```

**Expected:** Status 401, error message

**Test 404 Not Found:**
```bash
curl http://localhost:3001/api/nonexistent
```

**Expected:** Status 404, error message

**Test Rate Limiting:**
```bash
for i in {1..150}; do
  curl http://localhost:3001/health
done
```

**Expected:** After 100 requests, status 429

---

### 2. Database Testing

#### 2.1 Schema Verification

In Supabase SQL Editor:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected:** 15 tables listed

#### 2.2 RLS Policies

```sql
-- Check RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

**Expected:** Most tables have `rowsecurity = true`

#### 2.3 Indexes

```sql
-- Check indexes exist
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** Multiple indexes on users, streams, oauth_connections

#### 2.4 Test Data (if seed.sql ran)

```sql
-- Check test users
SELECT email, username, role, subscription_tier
FROM users
WHERE email LIKE '%@swanythree.com';
```

**Expected:** 3 test users returned

---

### 3. WebSocket Testing

#### 3.1 Manual Testing with JavaScript Console

Open browser console at `http://localhost:5173` and run:

```javascript
// Test Streams WebSocket
const streamSocket = io('ws://localhost:3001/streams', {
  auth: { token: 'your_jwt_token' }
});

streamSocket.on('connect', () => {
  console.log('✅ Streams socket connected');
});

streamSocket.on('stream:status:update', (data) => {
  console.log('📡 Stream status update:', data);
});

// Join a stream room
streamSocket.emit('stream:join', { streamId: 'test-stream-id' });
```

**Expected:** Connection successful, can join rooms

#### 3.2 Chat WebSocket

```javascript
const chatSocket = io('ws://localhost:3001/chat', {
  auth: { token: 'your_jwt_token' }
});

chatSocket.on('connect', () => {
  console.log('✅ Chat socket connected');
});

chatSocket.on('chat:message:new', (message) => {
  console.log('💬 New message:', message);
});
```

**Expected:** Connection successful, receives messages

---

### 4. Frontend Testing

#### 4.1 Build Test

```bash
cd apps/frontend
npm run build
```

**Expected:**
- Build completes without errors
- `dist/` directory created
- Assets properly bundled

#### 4.2 Navigation Test

Manually test all routes:

- [ ] `/login` - Login page renders
- [ ] `/register` - Register page renders
- [ ] `/` - Dashboard (requires auth)
- [ ] `/studio` - Live Studio page
- [ ] `/podcast` - AI Podcast Studio
- [ ] `/avatar` - Avatar Studio
- [ ] `/fanbase` - Fanbase Hub
- [ ] `/chat` - Universal Chat
- [ ] `/monetization` - Monetization page
- [ ] `/content` - Content Library
- [ ] `/marketplace` - Marketplace
- [ ] `/analytics` - Analytics page
- [ ] `/integrations` - Integrations page
- [ ] `/settings` - Settings page

#### 4.3 Responsive Design Test

Test on different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Tools:**
- Chrome DevTools Device Toolbar
- Firefox Responsive Design Mode
- Actual devices

#### 4.4 Browser Compatibility

Test on:

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

#### 4.5 Authentication Flow

1. Register new account:
   - [ ] Form validation works
   - [ ] Password confirmation required
   - [ ] Success toast shown
   - [ ] Redirected to dashboard

2. Logout:
   - [ ] Token cleared
   - [ ] Redirected to login
   - [ ] Can't access protected routes

3. Login:
   - [ ] Form validation works
   - [ ] Incorrect credentials rejected
   - [ ] Success toast shown
   - [ ] Redirected to dashboard

4. Token Refresh:
   - [ ] Expired token automatically refreshed
   - [ ] User stays logged in
   - [ ] Seamless experience

#### 4.6 Feature Testing

**Dashboard:**
- [ ] Stats display correctly
- [ ] Quick actions work
- [ ] Recent streams load
- [ ] Real-time updates (if applicable)

**Live Studio:**
- [ ] Stream list loads
- [ ] Can create stream
- [ ] Modal opens/closes
- [ ] Form validation
- [ ] Platform selection
- [ ] Status badges correct

**AI Podcast Studio:**
- [ ] Form accepts input
- [ ] Validation works
- [ ] Generate button triggers API
- [ ] Loading state shown
- [ ] Script displays
- [ ] Copy button works
- [ ] Download button works

**Settings:**
- [ ] Profile form loads
- [ ] Can update username
- [ ] Can update bio
- [ ] Success message shown
- [ ] Tabs switch correctly

---

### 5. Integration Testing

#### 5.1 Full User Journey

1. **New User Registration:**
   - [ ] Visit application
   - [ ] Click Register
   - [ ] Fill form
   - [ ] Submit
   - [ ] Verify email stored in DB
   - [ ] JWT token received
   - [ ] Redirected to dashboard

2. **Create Stream:**
   - [ ] Navigate to Live Studio
   - [ ] Click Create Stream
   - [ ] Fill details
   - [ ] Select platforms
   - [ ] Submit
   - [ ] Stream appears in list
   - [ ] Stored in database

3. **Generate Podcast:**
   - [ ] Navigate to AI Podcast
   - [ ] Enter topic
   - [ ] Select options
   - [ ] Generate
   - [ ] Script received
   - [ ] Can copy
   - [ ] Can download

4. **Chat Test:**
   - [ ] Open chat
   - [ ] Send message
   - [ ] Message appears
   - [ ] Real-time delivery

5. **Logout and Login:**
   - [ ] Logout
   - [ ] Login again
   - [ ] Previous data persists

---

### 6. Performance Testing

#### 6.1 API Response Times

```bash
# Install Apache Bench
# Test health endpoint
ab -n 1000 -c 10 http://localhost:3001/health
```

**Expected:**
- Mean response time < 100ms
- No failed requests

#### 6.2 Frontend Load Time

Use Chrome DevTools Lighthouse:

1. Open DevTools
2. Navigate to Lighthouse tab
3. Run audit

**Target Scores:**
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

#### 6.3 WebSocket Performance

```javascript
// Send 100 messages and measure response time
const start = Date.now();
let received = 0;

socket.on('echo', () => {
  received++;
  if (received === 100) {
    console.log(`Time: ${Date.now() - start}ms`);
  }
});

for (let i = 0; i < 100; i++) {
  socket.emit('ping');
}
```

**Expected:** All messages received, < 1000ms total

---

### 7. Security Testing

#### 7.1 SQL Injection

Try malicious inputs:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com OR 1=1--",
    "password": "anything"
  }'
```

**Expected:** Rejected, no database error

#### 7.2 XSS Prevention

Try script injection in forms:

```javascript
// In chat or profile bio
<script>alert('XSS')</script>
```

**Expected:** Sanitized, no script execution

#### 7.3 CSRF Protection

Try making API call from different origin:

```bash
curl -X POST http://localhost:3001/api/streams \
  -H "Origin: http://evil.com" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Blocked by CORS

#### 7.4 Rate Limiting

```bash
# Rapid requests
for i in {1..150}; do
  curl http://localhost:3001/api/auth/me \
    -H "Authorization: Bearer $TOKEN"
done
```

**Expected:** After 100 requests, 429 Too Many Requests

---

### 8. Error Scenarios

Test how the application handles errors:

#### 8.1 Database Unavailable

1. Stop Supabase or use invalid credentials
2. Try to login
3. **Expected:** Graceful error message, not crash

#### 8.2 API Down

1. Stop backend
2. Try to use frontend
3. **Expected:** Error toast, connection status indicator

#### 8.3 Invalid Token

1. Use expired or malformed JWT
2. Try protected endpoint
3. **Expected:** 401 error, redirect to login

#### 8.4 Network Errors

1. Use browser DevTools to simulate offline
2. Try to perform actions
3. **Expected:** Offline indicator, retry mechanisms

---

### 9. Load Testing

For production readiness:

```bash
# Install k6
brew install k6  # macOS
# or download from k6.io

# Create test script test.js:
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  let res = http.get('http://localhost:3001/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}

# Run test
k6 run test.js
```

**Expected:**
- All checks pass
- No failed requests
- Response time acceptable

---

### 10. Accessibility Testing

#### 10.1 Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Arrow keys in lists/menus

#### 10.2 Screen Reader

Use NVDA (Windows) or VoiceOver (macOS):

- [ ] All images have alt text
- [ ] Form labels read correctly
- [ ] Buttons describe action
- [ ] Error messages announced

#### 10.3 Color Contrast

Use browser extension or online tool:

- [ ] Text meets WCAG AA (4.5:1)
- [ ] Large text meets WCAG AA (3:1)
- [ ] Interactive elements have focus indicators

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

### Configuration
- [ ] All environment variables set
- [ ] CORS origins configured
- [ ] JWT secret is strong (32+ chars)
- [ ] API keys valid and funded
- [ ] Database schema applied
- [ ] RLS policies enabled

### Security
- [ ] No secrets in code
- [ ] HTTPS enforced
- [ ] Rate limiting active
- [ ] Input validation everywhere
- [ ] Headers secured (Helmet)

### Performance
- [ ] Database indexed
- [ ] Images optimized
- [ ] Code minified
- [ ] Caching configured
- [ ] CDN setup (if applicable)

### Monitoring
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Uptime monitoring active
- [ ] Backup strategy in place

### Testing
- [ ] All tests passing
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Accessibility verified

---

## 🐛 Bug Report Template

When reporting issues, include:

```markdown
## Environment
- OS: [e.g., macOS 13.0]
- Node: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]
- Build: [commit hash or version]

## Steps to Reproduce
1. Go to...
2. Click on...
3. Scroll down to...

## Expected Behavior
[What you expected]

## Actual Behavior
[What actually happened]

## Screenshots
[If applicable]

## Console Logs
```
[Paste logs here]
```

## Network Logs
[Any relevant network errors]
```

---

## 📊 Test Coverage Goals

Target coverage (future):

- Unit Tests: > 80%
- Integration Tests: > 60%
- E2E Tests: Critical paths covered

---

**Happy Testing! 🧪**
