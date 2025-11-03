# Quick Deployment Guide - Netlify + Backend Split

## The Problem You Had

Your Netlify deployment was failing because:
- Netlify is a **static site host** (only serves HTML/CSS/JS files)
- Your app has a **backend server** with API routes (Express.js)
- When the frontend tried to call `/api/auth/login`, Netlify returned a 404 page

## The Solution

Split your deployment into two parts:
1. **Frontend on Netlify** - Static React app
2. **Backend on Railway/Render** - Express API server

## Quick Setup (10 Minutes)

### Step 1: Deploy Backend First

**Option A: Railway (Easiest)**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables:
   ```
   NODE_ENV=production
   SESSION_SECRET=cabe321b965b22daeebcc2923d7eb85ba018b1bb021cd61a3e31e474e4337092
   SUPABASE_URL=https://vwovemvfbfzurhhktbst.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3ZlbXZmYmZ6dXJoaGt0YnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDIwNTYsImV4cCI6MjA3NzY3ODA1Nn0.EMJD5DMsQT3wxEwkUXRexLWkorhJKPTXAON8SSutKEE
   ```
5. Copy your Railway URL (e.g., `https://your-app.railway.app`)

**Option B: Render**

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Set Build: `npm install && npm run build`
5. Set Start: `npm run start`
6. Add the same environment variables as above
7. Copy your Render URL (e.g., `https://your-app.onrender.com`)

### Step 2: Deploy Frontend to Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import from Git"
3. Select your GitHub repo
4. Add environment variables in Netlify:
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend.railway.app
   VITE_SUPABASE_URL=https://vwovemvfbfzurhhktbst.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3ZlbXZmYmZ6dXJoaGt0YnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDIwNTYsImV4cCI6MjA3NzY3ODA1Nn0.EMJD5DMsQT3wxEwkUXRexLWkorhJKPTXAON8SSutKEE
   ```

   **IMPORTANT**: Replace `https://your-backend.railway.app` with your actual backend URL from Step 1!

5. Deploy!

### Step 3: Update Backend with Frontend URL

1. Go back to Railway/Render
2. Add one more environment variable:
   ```
   FRONTEND_URL=https://your-site.netlify.app
   ```
3. Redeploy backend

### Step 4: Test

1. Visit your Netlify URL
2. Click "Admin Login"
3. Enter:
   - Username: `administrator`
   - Password: `RutgersChess@123`
4. Should work!

## What Changed in Your Code

### 1. Added `netlify.toml`
Tells Netlify how to build and where to find files.

### 2. Updated `client/src/lib/queryClient.ts`
Now reads `VITE_API_URL` to know where the backend is.

### 3. Updated `server/index.ts`
Added Netlify domains to CORS whitelist.

## Troubleshooting

### "404 Not Found" on Login
- **Problem**: Backend URL is wrong
- **Fix**: Check `VITE_API_URL` in Netlify matches your backend URL exactly

### "CORS Error"
- **Problem**: Backend doesn't allow your Netlify domain
- **Fix**: Set `FRONTEND_URL` on backend to your Netlify URL

### Login Works But Doesn't Stay Logged In
- **Problem**: Cookies not working across domains
- **Fix**: Both URLs must use HTTPS (they should automatically)

### Backend Times Out
- **Problem**: Free tier cold starts (Railway/Render)
- **Solution**: First request may take 30 seconds, then it's fast

## File Structure

```
project/
├── netlify.toml              # NEW - Netlify config
├── NETLIFY_DEPLOYMENT.md     # NEW - Full guide
├── QUICK_DEPLOY_GUIDE.md     # NEW - This file
├── client/                   # Frontend (Netlify)
│   └── src/
│       └── lib/
│           └── queryClient.ts # UPDATED - API base URL
└── server/                   # Backend (Railway/Render)
    └── index.ts              # UPDATED - CORS for Netlify
```

## Environment Variables Cheat Sheet

### Backend (Railway/Render)
```bash
NODE_ENV=production
SESSION_SECRET=<your-secret>
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-key>
FRONTEND_URL=<your-netlify-url>  # Optional but recommended
```

### Frontend (Netlify)
```bash
NODE_ENV=production
VITE_API_URL=<your-backend-url>  # CRITICAL - Backend URL here!
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
```

## Cost

- **Netlify**: Free (100GB bandwidth/month)
- **Railway**: $5 free credit/month (pay after)
- **Render**: Free with limitations (slower cold starts)
- **Supabase**: Free tier is generous

Total: **$0-5/month** for most small sites

## Support

Need help? Check:
1. **Full Guide**: `NETLIFY_DEPLOYMENT.md` (detailed instructions)
2. **Backend Logs**: Check Railway/Render dashboard → Logs
3. **Frontend Logs**: Browser DevTools → Console
4. **Network Requests**: Browser DevTools → Network tab

## Key Points to Remember

1. **Two Deployments**: Frontend on Netlify, Backend on Railway/Render
2. **VITE_API_URL**: Must point to your backend URL
3. **FRONTEND_URL**: Must point to your Netlify URL
4. **Both URLs**: Must use HTTPS
5. **Redeploy**: After changing environment variables
