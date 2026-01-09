# SwanyThree Ultimate - Deployment Guide

This guide covers deploying SwanyThree Ultimate to production using Railway (backend) and Vercel (frontend).

## Prerequisites

- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Supabase project
- Anthropic API key
- (Optional) Stripe account
- Git repository

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to https://app.supabase.com
2. Create new project
3. Wait for database provisioning
4. Note your project URL and keys

### 2. Run Database Schema

1. Navigate to SQL Editor
2. Copy contents of `apps/backend/schema.sql`
3. Execute the SQL
4. Verify all 15 tables are created
5. Check RLS policies are enabled

### 3. Get Connection Details

From Project Settings → API:
- Project URL: `https://[project-id].supabase.co`
- Anon/Public Key: `eyJhbG...`
- Service Role Key: `eyJhbG...` (keep secret!)

## 🚂 Backend Deployment (Railway)

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Project

```bash
cd apps/backend
railway init
```

Select "Create new project" and name it `swanythree-backend`

### 4. Set Environment Variables

In Railway dashboard:

```
NODE_ENV=production
PORT=3001

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# JWT - Generate strong secret
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here

# Stripe (optional)
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# CORS - Update after Vercel deployment
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app

# OAuth Providers (optional)
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
# ... add others as needed
```

### 5. Deploy

```bash
railway up
```

Railway will:
- Build your app
- Start the server
- Provide a public URL

### 6. Get Backend URL

From Railway dashboard, copy your deployment URL:
`https://swanythree-backend.railway.app`

### 7. Configure Custom Domain (Optional)

1. Railway dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records

## ▲ Frontend Deployment (Vercel)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Configure Build Settings

From `apps/frontend`:

```bash
vercel
```

Follow prompts:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: swanythree-ultimate
- Directory: `./` (current)
- Override settings: No

### 4. Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://swanythree-backend.railway.app
VITE_WS_URL=wss://swanythree-backend.railway.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_STREAMING=true
VITE_ENABLE_PAYMENTS=true
```

Add for all environments (Production, Preview, Development)

### 5. Deploy to Production

```bash
vercel --prod
```

### 6. Get Frontend URL

Vercel provides URL:
`https://swanythree-ultimate.vercel.app`

### 7. Configure Custom Domain (Optional)

1. Vercel dashboard → Settings → Domains
2. Add domain
3. Update DNS records

## 🔄 Update Backend CORS

Now that you have your frontend URL, update Railway environment variables:

```
FRONTEND_URL=https://swanythree-ultimate.vercel.app
CORS_ORIGINS=https://swanythree-ultimate.vercel.app
```

Redeploy backend:
```bash
railway up
```

## 🔌 OAuth Configuration

For each platform you want to integrate:

### Twitch
1. https://dev.twitch.tv/console
2. Create application
3. Redirect URI: `https://your-app.vercel.app/auth/callback/twitch`
4. Add Client ID and Secret to Railway

### YouTube
1. https://console.cloud.google.com
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Redirect URI: `https://your-app.vercel.app/auth/callback/youtube`
5. Add credentials to Railway

### Repeat for other platforms
- Facebook: https://developers.facebook.com
- Twitter: https://developer.twitter.com
- TikTok: https://developers.tiktok.com
- Instagram: https://developers.facebook.com/products/instagram
- LinkedIn: https://www.linkedin.com/developers

## 💳 Stripe Setup (Optional)

### 1. Create Stripe Account

https://dashboard.stripe.com

### 2. Get API Keys

Dashboard → Developers → API keys
- Publishable key (for frontend)
- Secret key (for backend)

### 3. Create Products

1. Dashboard → Products
2. Create products for each tier:
   - Basic: $29/month
   - Pro: $99/month
   - Enterprise: $299/month
3. Note Price IDs

### 4. Configure Webhooks

1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://swanythree-backend.railway.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret

### 5. Update Backend Code

Edit `apps/backend/src/routes/monetization.js`:

```javascript
const priceIds = {
  basic: 'price_your_basic_price_id',
  pro: 'price_your_pro_price_id',
  enterprise: 'price_your_enterprise_price_id',
};
```

## ✅ Verify Deployment

### Backend Health Check

```bash
curl https://swanythree-backend.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production"
}
```

### Frontend

Visit `https://swanythree-ultimate.vercel.app`
- Should load without errors
- Register a test account
- Verify WebSocket connection
- Test creating a stream

## 📊 Monitoring

### Railway Logs

```bash
railway logs
```

### Vercel Logs

Dashboard → Deployments → Select deployment → Logs

### Database

Supabase dashboard → Database → Logs

## 🔧 Troubleshooting

### CORS Errors

Ensure `FRONTEND_URL` and `CORS_ORIGINS` in Railway match your Vercel URL exactly.

### WebSocket Connection Failed

1. Check `VITE_WS_URL` uses `wss://` (not `ws://`)
2. Verify Railway deployment is running
3. Check browser console for errors

### Database Connection Issues

1. Verify Supabase credentials
2. Check RLS policies allow access
3. Test connection with SQL Editor

### 500 Errors

1. Check Railway logs: `railway logs`
2. Verify all environment variables are set
3. Check Anthropic API key is valid

## 🚀 CI/CD (Optional)

### GitHub Actions for Backend

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['apps/backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Vercel Git Integration

Vercel automatically deploys on git push when connected to repository.

## 📝 Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] Login works
- [ ] JWT persists across refresh
- [ ] WebSocket connects successfully
- [ ] Stream creation works
- [ ] AI features work (if enabled)
- [ ] OAuth connections work (if configured)
- [ ] Stripe checkout works (if configured)
- [ ] All pages render correctly
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables secured
- [ ] Database backups configured

## 🔐 Security Recommendations

1. **Rotate Secrets Regularly**
   - JWT secret every 90 days
   - API keys annually

2. **Enable Rate Limiting**
   - Already configured (100 req/15min)
   - Monitor for abuse

3. **Database Backups**
   - Supabase automatic backups enabled
   - Test restore procedure

4. **Monitor Logs**
   - Set up alerts for errors
   - Review logs weekly

5. **SSL/TLS**
   - Both Railway and Vercel provide SSL
   - Verify HTTPS enforced

## 🎉 Success!

Your SwanyThree Ultimate platform is now live in production!

For support, refer to the main README.md or open an issue.
