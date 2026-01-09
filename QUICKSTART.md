# SwanyThree Ultimate - Quick Start Guide

Get SwanyThree Ultimate running locally in 5 minutes!

## ⚡ Automated Setup (Recommended)

### Linux/macOS
```bash
./scripts/setup.sh
```

### Windows
```bash
scripts\setup.bat
```

The script will:
- ✅ Check Node.js version
- ✅ Install all dependencies
- ✅ Create environment files
- ✅ Guide you through configuration

---

## 🔧 Manual Setup

### 1. Prerequisites

Ensure you have:
- ✅ Node.js 18+ ([Download](https://nodejs.org))
- ✅ npm 9+
- ✅ Git

**Check versions:**
```bash
node -v  # Should be v18.0.0 or higher
npm -v   # Should be 9.0.0 or higher
```

### 2. Clone Repository

```bash
git clone <repository-url>
cd swanythree-ultimate
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ../..
```

### 4. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in details and create
4. Wait for provisioning (~2 minutes)

### 5. Setup Database

1. Navigate to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy contents of `apps/backend/schema.sql`
4. Paste and click "Run"
5. Verify 15 tables created in Table Editor

**Optional - Add test data:**
- Run `apps/backend/seed.sql` the same way
- Test users: `demo@swanythree.com` / `password123`

### 6. Get API Keys

#### Supabase (Required)
1. Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep secret!)

#### Anthropic Claude (Required)
1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Create account/login
3. API Keys → Create Key
4. Copy key (starts with `sk-ant-`)

#### Stripe (Optional - for payments)
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your test API keys

### 7. Configure Backend

```bash
cd apps/backend
cp .env.example .env
```

Edit `apps/backend/.env`:
```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional
STRIPE_SECRET_KEY=sk_test_...
```

**Generate secure JWT secret:**
```bash
# Linux/macOS
openssl rand -base64 32

# Windows (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 8. Configure Frontend

```bash
cd apps/frontend
cp .env.example .env
```

Edit `apps/frontend/.env`:
```bash
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### 9. Start Development Servers

**From project root:**
```bash
npm run dev
```

This starts both backend and frontend simultaneously!

**Or start individually:**

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

### 10. Access Application

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3001
- ❤️ **Health Check**: http://localhost:3001/health

---

## 🎯 First Steps in the App

### 1. Register Account

1. Navigate to http://localhost:5173
2. Click "Register now"
3. Fill in:
   - Email: your@email.com
   - Username: yourusername
   - Password: minimum 8 characters
4. Click "Create Account"

### 2. Explore Dashboard

After registration, you'll see:
- ✅ Stream statistics
- ✅ Quick action cards
- ✅ Real-time connection status

### 3. Generate Your First Podcast

1. Click "AI Podcast" in sidebar
2. Enter topic: "The Future of Streaming"
3. Select options:
   - Duration: 10 minutes
   - Tone: Professional
   - Speakers: 2
4. Click "Generate Script"
5. Wait ~10 seconds for Claude to generate
6. Copy or download your script!

### 4. Create a Stream

1. Click "Live Studio" in sidebar
2. Click "Create Stream"
3. Fill in:
   - Title: "My First Stream"
   - Description: "Testing SwanyThree"
   - Platforms: Select any (requires OAuth setup)
4. Click "Create"

**Note**: To actually start streaming, you need to connect OAuth platforms in Integrations.

### 5. Connect Platforms (Optional)

1. Click "Integrations" in sidebar
2. Click "Connect" on desired platform
3. Follow OAuth flow
4. Return to Live Studio to start streaming!

---

## 🐳 Docker Setup (Alternative)

If you prefer Docker:

```bash
# Copy environment files first
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Edit the .env files with your credentials

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Redis: localhost:6379

---

## 🧪 Using Test Data

If you ran `seed.sql`, you can login with test accounts:

| Email | Password | Tier |
|-------|----------|------|
| demo@swanythree.com | password123 | Pro |
| streamer@swanythree.com | password123 | Enterprise |
| admin@swanythree.com | password123 | Admin |

Test data includes:
- ✅ Sample streams
- ✅ Chat rooms and messages
- ✅ AI-generated content
- ✅ Mock OAuth connections
- ✅ Notifications

---

## 🔍 Verify Installation

### Backend Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-09T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Frontend Build
```bash
cd apps/frontend
npm run build
```

Should complete without errors.

### WebSocket Connection

Open browser console at http://localhost:5173 and check for:
```
Connected to /streams socket
Connected to /chat socket
Connected to /notifications socket
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules
npm install
cd apps/backend && npm install
cd ../frontend && npm install
```

### "Port already in use"
```bash
# Find and kill process on port 3001
# Linux/macOS
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database connection errors
1. Verify Supabase URL and keys
2. Check schema.sql ran successfully
3. Test connection in Supabase SQL Editor

### WebSocket connection fails
1. Ensure backend is running
2. Check `VITE_WS_URL` in frontend/.env
3. Verify CORS settings in backend

### Claude API errors
1. Verify `ANTHROPIC_API_KEY` is correct
2. Check API key has credits/quota
3. Test with a simple request

---

## 📚 Next Steps

1. **Read Documentation**
   - [README.md](./README.md) - Full documentation
   - [API.md](./API.md) - API reference
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment

2. **Customize Branding**
   - Edit `apps/frontend/tailwind.config.js` for colors
   - Update logo and favicons

3. **Setup OAuth**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md#oauth-configuration)
   - Configure each platform you want to use

4. **Enable Payments**
   - Setup Stripe account
   - Configure webhooks
   - Update price IDs

5. **Deploy to Production**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Railway for backend
   - Vercel for frontend

---

## 💡 Pro Tips

1. **Use test data**: Run `seed.sql` for instant demo data
2. **Watch logs**: Keep terminal visible to see real-time logs
3. **Browser DevTools**: Use Network tab to debug API calls
4. **Hot reload**: Changes auto-reload in development
5. **Database viewer**: Use Supabase Table Editor to view data

---

## 🆘 Getting Help

- 📖 **Documentation**: Check README.md and API.md
- 🐛 **Issues**: Open issue on GitHub
- 💬 **Discussions**: GitHub Discussions
- 📧 **Email**: support@swanythree.com (if configured)

---

**Happy Streaming! 🎉**

Built with ❤️ using Claude Code
