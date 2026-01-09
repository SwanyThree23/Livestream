# SwanyThree Ultimate 🚀

**Full-stack AI-powered multi-platform streaming application**

A production-grade platform for streaming to multiple social media platforms simultaneously, with AI-powered content generation, real-time analytics, and monetization features.

## 🌟 Features

### Core Features
- **Multi-Platform Streaming**: Stream to Twitch, YouTube, Facebook, Twitter, TikTok, Instagram, and LinkedIn simultaneously
- **AI Content Generation**: Claude Sonnet 4 powered podcast scripts, content ideas, and optimization
- **Real-Time Chat**: Universal chat system with typing indicators, read receipts, and reactions
- **Live Analytics**: Real-time viewer stats, engagement metrics, and platform comparisons
- **Monetization**: Stripe-powered subscription tiers with revenue tracking
- **Content Library**: Organized media library with tagging and filtering

### Technical Features
- **WebSocket Integration**: Real-time updates for streams, chat, and notifications
- **OAuth Authentication**: Secure multi-platform account linking
- **Row Level Security**: Database-level security with Supabase RLS policies
- **Responsive Design**: Mobile-first UI with dark mode support
- **Type-Safe**: Zod schema validation throughout

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express
- Socket.io for WebSockets
- PostgreSQL (Supabase)
- Anthropic Claude Sonnet 4
- Stripe for payments
- JWT authentication

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Zustand state management
- Socket.io-client
- React Router v6

**Deployment:**
- Backend: Railway
- Frontend: Vercel
- Database: Supabase

## 📁 Project Structure

```
swanythree-ultimate/
├── apps/
│   ├── backend/               # Express API server
│   │   ├── src/
│   │   │   ├── config/       # Environment configuration
│   │   │   ├── middleware/   # Auth, error handling, metrics
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── sockets/      # WebSocket handlers
│   │   │   ├── utils/        # Logger, helpers
│   │   │   └── index.js      # Server entry point
│   │   ├── schema.sql        # Database schema
│   │   └── package.json
│   └── frontend/             # React application
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── pages/        # Page components
│       │   ├── lib/          # API client
│       │   ├── hooks/        # Custom hooks
│       │   ├── store/        # Zustand stores
│       │   └── main.jsx      # App entry point
│       └── package.json
└── package.json              # Workspace root
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account
- Anthropic API key
- (Optional) Stripe account for payments

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd swanythree-ultimate
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Backend**
```bash
cd apps/backend
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET` (min 32 characters)
- `ANTHROPIC_API_KEY`

4. **Setup Database**
- Create a Supabase project
- Run `schema.sql` in the SQL Editor
- Verify all 15 tables are created

5. **Setup Frontend**
```bash
cd apps/frontend
cp .env.example .env
# Edit .env with backend URL
```

6. **Run Development Servers**

From project root:
```bash
npm run dev
```

Or individually:
```bash
# Backend (from apps/backend)
npm run dev

# Frontend (from apps/frontend)
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

## 📊 Database Schema

15 tables with Row Level Security:
- `users` - User accounts
- `oauth_connections` - Platform connections
- `streams` - Live streams
- `stream_metrics` - Analytics data
- `ai_content` - Generated content
- `ai_conversations` - Chat history
- `content` - Media library
- `chat_rooms` - Chat rooms
- `chat_participants` - Room members
- `chat_messages` - Messages
- `chat_read_receipts` - Read status
- `chat_reactions` - Message reactions
- `notifications` - User notifications
- `subscriptions` - Stripe subscriptions
- `webhooks` - External events

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Streams
- `GET /api/streams` - List streams
- `POST /api/streams` - Create stream
- `POST /api/streams/:id/start` - Start stream
- `POST /api/streams/:id/stop` - Stop stream
- `GET /api/streams/:id/analytics` - Get analytics

### AI
- `POST /api/ai/podcast/generate` - Generate podcast script
- `POST /api/ai/content/ideas` - Generate content ideas
- `POST /api/ai/content/optimize` - Optimize content
- `POST /api/ai/chat` - Chat with Claude
- `GET /api/ai/usage` - Get AI usage stats

### WebSocket Namespaces
- `/streams` - Stream status and metrics
- `/chat` - Real-time messaging
- `/notifications` - Live notifications

## 🎨 Customization

### Branding Colors
Edit `apps/frontend/tailwind.config.js`:
```js
colors: {
  brand: {
    primary: '#6366f1',   // Your primary color
    secondary: '#8b5cf6', // Your secondary color
    accent: '#ec4899'     // Your accent color
  }
}
```

### Feature Flags
Edit `apps/frontend/.env`:
```
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_STREAMING=true
VITE_ENABLE_PAYMENTS=true
```

## 🔒 Security

- Helmet.js with Content Security Policy
- CORS configuration
- Rate limiting (100 requests/15min)
- JWT with refresh tokens
- Bcrypt password hashing (12 rounds)
- Input validation with Zod
- Row Level Security policies
- WebSocket authentication

## 📈 Monitoring

- Winston logging with daily rotation
- Request/response metrics
- Error tracking
- Health check endpoint
- Database indexes for performance

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Backend (Railway):**
```bash
cd apps/backend
railway init
railway up
```

**Frontend (Vercel):**
```bash
cd apps/frontend
vercel
```

## 🧪 Development

### Code Style
- Use async/await for async operations
- Try-catch error handling
- Modular architecture
- DRY principle
- Comprehensive logging

### Testing
```bash
npm run test
```

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions, please open a GitHub issue.

## 🙏 Acknowledgments

- Anthropic Claude for AI features
- Supabase for database and auth
- Railway and Vercel for hosting
- All open-source contributors

---

**Built with ❤️ using Claude Code**
