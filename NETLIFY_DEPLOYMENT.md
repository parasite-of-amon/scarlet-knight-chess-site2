# Netlify Deployment Guide - Split Architecture

This guide explains how to deploy the Rutgers Chess Club website using a split architecture:
- **Frontend**: Hosted on Netlify (static assets)
- **Backend**: Hosted on Railway, Render, or similar Node.js platform (Express API server)

## Architecture Overview

The application is split into two separate deployments:

1. **Netlify (Frontend)**
   - Serves the built React/Vite static assets
   - Routes API requests to the external backend
   - Handles frontend routing via SPA fallback

2. **External Backend (Railway/Render/Fly.io)**
   - Runs the Express server with all API routes
   - Manages session-based authentication
   - Connects to Supabase database

## Prerequisites

Before deploying, ensure you have:
- [ ] A GitHub repository with this code
- [ ] Supabase project set up and accessible
- [ ] Admin credentials configured in Supabase database
- [ ] A Netlify account
- [ ] A Railway/Render/Fly.io account (for backend)

## Part 1: Deploy Backend Server

### Option A: Railway (Recommended)

1. **Create New Project**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Environment Variables**
   Add these in Railway dashboard → Variables:
   ```
   NODE_ENV=production
   SESSION_SECRET=<generate-secure-random-string>
   SUPABASE_URL=https://vwovemvfbfzurhhktbst.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3ZlbXZmYmZ6dXJoaGt0YnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDIwNTYsImV4cCI6MjA3NzY3ODA1Nn0.EMJD5DMsQT3wxEwkUXRexLWkorhJKPTXAON8SSutKEE
   FRONTEND_URL=https://your-site.netlify.app
   ```

3. **Generate SESSION_SECRET**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Configure Build Settings**
   - Railway auto-detects Node.js
   - Start Command: `npm run start`
   - Build Command: `npm run build`

5. **Deploy and Get URL**
   - Railway will automatically deploy
   - Copy your Railway URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Create New Web Service**
   - Go to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings**
   - Name: `rutgers-chess-backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Plan: Free (or paid for better performance)

3. **Environment Variables**
   Add the same variables as Railway (see above)

4. **Deploy and Get URL**
   - Click "Create Web Service"
   - Copy your Render URL (e.g., `https://your-app.onrender.com`)

### Option C: Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and Initialize**
   ```bash
   fly auth login
   fly launch
   ```

3. **Set Secrets**
   ```bash
   fly secrets set SESSION_SECRET="<your-secret>"
   fly secrets set SUPABASE_URL="<your-url>"
   fly secrets set SUPABASE_ANON_KEY="<your-key>"
   fly secrets set NODE_ENV="production"
   fly secrets set FRONTEND_URL="https://your-site.netlify.app"
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

## Part 2: Deploy Frontend to Netlify

### 1. Connect GitHub Repository

1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository
5. Authorize Netlify to access your repository

### 2. Configure Build Settings

Netlify should auto-detect the `netlify.toml` configuration. Verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Production branch**: `main` (or your default branch)

### 3. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

```
NODE_ENV=production
VITE_API_URL=https://your-backend.railway.app
VITE_SUPABASE_URL=https://vwovemvfbfzurhhktbst.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3ZlbXZmYmZ6dXJoaGt0YnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDIwNTYsImV4cCI6MjA3NzY3ODA1Nn0.EMJD5DMsQT3wxEwkUXRexLWkorhJKPTXAON8SSutKEE
```

**CRITICAL**: Replace `https://your-backend.railway.app` with your actual backend URL from Part 1.

### 4. Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Copy your Netlify URL (e.g., `https://your-site.netlify.app`)

### 5. Update Backend CORS

Go back to your backend hosting platform and update the `FRONTEND_URL` environment variable with your actual Netlify URL:

```
FRONTEND_URL=https://your-site.netlify.app
```

Redeploy the backend for changes to take effect.

## Verification Checklist

After deployment, test the following:

### Backend Health Check

1. Visit `https://your-backend.railway.app/api/auth/check`
2. Should return: `{"isAdmin":false}`
3. Check logs for "Server running on port 5000"

### Frontend Loading

1. Visit your Netlify URL
2. Site should load properly
3. Open DevTools → Console
4. Should see no CORS errors

### Authentication Flow

1. Click "Admin Login" on your Netlify site
2. Enter credentials:
   - Username: `administrator`
   - Password: `RutgersChess@123`
3. Submit login
4. Check Network tab:
   - POST to `/api/auth/login` should succeed (200)
   - Cookie should be set
5. Verify admin panel loads

### Session Persistence

1. After login, refresh the page
2. Should remain logged in
3. Navigate to different pages
4. Admin features should remain accessible

## Troubleshooting

### 404 on API Routes

**Problem**: API requests return 404 errors

**Solutions**:
- Verify `VITE_API_URL` is set correctly in Netlify
- Ensure backend is running and accessible
- Check backend logs for errors
- Test backend directly: `curl https://your-backend.railway.app/api/auth/check`

### CORS Errors

**Problem**: Browser console shows CORS errors

**Solutions**:
- Verify `FRONTEND_URL` matches your Netlify URL exactly
- Check backend CORS configuration includes `.netlify.app`
- Ensure both URLs use HTTPS
- Redeploy backend after CORS changes

### Login Not Working

**Problem**: Login fails or doesn't persist

**Solutions**:
- Check backend logs for authentication errors
- Verify `SESSION_SECRET` is set on backend
- Ensure `credentials: 'include'` in frontend requests
- Check cookies in DevTools (Application → Cookies)
- Verify `secure: true` and `sameSite: 'none'` for production

### Session Not Persisting

**Problem**: Logged out after page refresh

**Solutions**:
- Verify session cookie is set (check DevTools)
- Ensure cookie has proper attributes (Secure, HttpOnly, SameSite)
- Check backend session configuration
- Verify `SESSION_SECRET` is consistent across deployments

### Build Failures

**Problem**: Netlify build fails

**Solutions**:
- Check build logs in Netlify dashboard
- Verify `VITE_API_URL` is set before build
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

## Environment Variables Reference

### Backend (Railway/Render/Fly.io)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `SESSION_SECRET` | Yes | Secure random string | Generate with crypto |
| `SUPABASE_URL` | Yes | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon key | `eyJhbG...` |
| `FRONTEND_URL` | Optional | Frontend origin for CORS | `https://site.netlify.app` |
| `PORT` | No | Server port (auto-set) | `5000` (default) |

### Frontend (Netlify)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `VITE_API_URL` | Yes | Backend API base URL | `https://app.railway.app` |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key | `eyJhbG...` |

## Security Best Practices

1. **SESSION_SECRET**: Generate a cryptographically secure random string
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **HTTPS Only**: Both frontend and backend must use HTTPS in production

3. **Secure Cookies**: Verify cookies have these attributes:
   - `Secure: true`
   - `HttpOnly: true`
   - `SameSite: none`

4. **Admin Credentials**: Change default credentials after first login

5. **Environment Variables**: Never commit secrets to Git

6. **Regular Updates**: Keep dependencies updated for security patches

## Custom Domain Setup (Optional)

### Netlify Frontend Domain

1. Go to Netlify → Domain settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Let's Encrypt)

### Backend Custom Domain

1. Add custom domain in Railway/Render dashboard
2. Configure CNAME record to point to backend
3. Update `FRONTEND_URL` on backend
4. Update `VITE_API_URL` on Netlify
5. Redeploy both services

## Monitoring and Logs

### Backend Logs

- **Railway**: Dashboard → Deployments → View Logs
- **Render**: Dashboard → Logs tab
- **Fly.io**: `fly logs` command

### Frontend Logs

- **Netlify**: Dashboard → Deploys → Deploy log
- **Browser**: DevTools → Console

### Key Log Patterns

Look for these in backend logs:
- `Server running on port 5000` - Server started
- `[Auth] Login successful!` - User logged in
- `POST /api/auth/login 200` - Login endpoint success
- `Session saved. SessionID: xxx` - Session created

## Continuous Deployment

Both platforms support automatic deployments:

1. **Push to GitHub**: Changes trigger automatic builds
2. **Netlify**: Rebuilds frontend automatically
3. **Railway/Render**: Redeploys backend automatically
4. **Preview Deploys**: Test changes before merging

## Cost Estimates

### Free Tier Limits

- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **Railway**: $5 free credit/month
- **Render**: 750 hours/month (static sites free)
- **Supabase**: 500MB database, 2GB bandwidth

### Recommended Paid Plans (if needed)

- **Netlify Pro**: $19/month (more bandwidth)
- **Railway**: Pay-as-you-go (typically $5-20/month)
- **Render**: $7/month (dedicated instance)

## Support and Resources

- **Netlify Documentation**: https://docs.netlify.com
- **Railway Documentation**: https://docs.railway.app
- **Render Documentation**: https://render.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Express Session Guide**: https://github.com/expressjs/session

## Additional Notes

- Backend may take 30-60 seconds to start (cold start on free tiers)
- Consider upgrading to paid plans for production workloads
- Monitor bandwidth and build minutes to avoid overages
- Set up uptime monitoring (e.g., UptimeRobot) for the backend
- Regular database backups via Supabase dashboard

## Quick Reference Commands

```bash
# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test backend locally
npm run start

# Build frontend locally
npm run build

# Test production build locally
npm run build && npm run start

# Deploy backend (Railway)
git push origin main

# Deploy frontend (Netlify)
git push origin main
```
