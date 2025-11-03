# Deployment Guide - Rutgers Chess Club Website

## Environment Variables Required

### Production Environment Variables

Your hosting platform MUST have the following environment variables configured:

#### 1. Supabase Configuration (Required)
```
SUPABASE_URL=https://vwovemvfbfzurhhktbst.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3ZlbXZmYmZ6dXJoaGt0YnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDIwNTYsImV4cCI6MjA3NzY3ODA1Nn0.EMJD5DMsQT3wxEwkUXRexLWkorhJKPTXAON8SSutKEE

VITE_SUPABASE_URL=https://vwovemvfbfzurhhktbst.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3ZlbXZmYmZ6dXJoaGt0YnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDIwNTYsImV4cCI6MjA3NzY3ODA1Nn0.EMJD5DMsQT3wxEwkUXRexLWkorhJKPTXAON8SSutKEE
```

#### 2. Session Secret (Required)
```
SESSION_SECRET=c5a7ef76f6fc359b7f07542de82b6ba36d9ed40cd5652afa40d9e16335b4f1d1d3771b7a168ee6c69a5787f1224c339278e19a032dd03c2ab270f099040e0ac0
```

**IMPORTANT:** This is a cryptographically secure random string used for session encryption. You can generate a new one using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 3. Node Environment (Auto-detected)
```
NODE_ENV=production
```

This is typically set automatically by hosting platforms when deploying to production.

## Admin Login Credentials

**Username:** `administrator`
**Password:** `RutgersChess@123`

These credentials are stored securely in the Supabase database with bcrypt hashing.

## Deployment Platform Instructions

### Option 1: Railway (Recommended)

1. Connect your GitHub repository to Railway
2. Add all environment variables listed above in the Railway dashboard
3. Railway will automatically detect and run the Express server
4. Deploy command: `npm run start`
5. Build command: `npm run build`

### Option 2: Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. Add all environment variables in the Render dashboard
5. Enable "Auto-Deploy" for automatic updates

### Option 3: Vercel

**Note:** Vercel requires serverless functions, which may require code modifications.

1. Install Vercel CLI: `npm i -g vercel`
2. Add environment variables through Vercel dashboard or CLI
3. Deploy: `vercel --prod`
4. May require converting Express routes to Vercel serverless functions

### Option 4: Fly.io

1. Install Fly CLI
2. Create fly.toml configuration
3. Set secrets: `flyctl secrets set SESSION_SECRET=...`
4. Deploy: `flyctl deploy`

## Required Server Features

Your hosting platform MUST support:

1. **Node.js Runtime** - The Express server requires Node.js to run
2. **Session Storage** - In-memory sessions work but are not persistent across restarts
3. **WebSocket Support** (Optional) - For real-time features if added later
4. **HTTPS/SSL** - Required for secure cookies in production

## Session Configuration

The application uses session-based authentication with the following settings:

### Production Settings
- **Cookie Security:** Secure flag enabled (HTTPS only)
- **Cookie SameSite:** `none` (allows cross-origin requests)
- **Cookie HttpOnly:** `true` (prevents XSS attacks)
- **Cookie Path:** `/` (available across entire site)
- **Session Duration:** 7 days
- **Proxy Trust:** Enabled for production

### Development Settings
- **Cookie Security:** Disabled (works with HTTP)
- **Cookie SameSite:** `lax`
- **All other settings:** Same as production

## Troubleshooting

### Admin Login Not Working

1. **Check Environment Variables**
   - Verify SESSION_SECRET is set in production
   - Verify SUPABASE_URL and SUPABASE_ANON_KEY are set
   - Check server logs for "SET" or "MISSING" status

2. **Check Session Cookies**
   - Open browser DevTools → Application → Cookies
   - Look for `rutgers.chess.session` cookie
   - Verify it's being set with correct attributes

3. **Check Server Logs**
   - Look for `[Auth]` prefixed messages
   - Check for "Session saved successfully" message after login
   - Look for any database connection errors

4. **Verify Database Connection**
   - Ensure Supabase project is accessible
   - Check if admin credentials exist in database
   - Test Supabase connection from deployment platform

5. **Check CORS and Credentials**
   - Verify `credentials: "include"` is in all API requests
   - Check if HTTPS is properly configured
   - Ensure cookie domain matches your deployment URL

### Common Issues

#### Issue: "Failed to save session"
**Solution:** Ensure SESSION_SECRET environment variable is set

#### Issue: Session not persisting across requests
**Solution:** Check that cookies are enabled and HTTPS is configured

#### Issue: "Invalid credentials" despite correct password
**Solution:** Verify bcrypt hash in database matches the password format

#### Issue: 401 Unauthorized on all admin operations
**Solution:** Check session is being created and cookie is being sent with requests

## Security Considerations

1. **Never commit the SESSION_SECRET to version control**
2. **Use HTTPS in production** - Required for secure cookies
3. **Admin credentials are hashed** - Password is never stored in plain text
4. **Row Level Security** - Supabase RLS policies protect database
5. **Session-based auth** - Server-side validation on all admin routes

## Database Schema

The application requires these Supabase tables:
- `admins` - Admin user accounts
- `events` - Event data
- `sponsors` - Sponsor information
- `page_content` - Dynamic page content

All tables have Row Level Security (RLS) enabled with proper policies.

## Build Process

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm install
npm run build
npm run start
```

## Support

For deployment issues:
1. Check this documentation
2. Review server logs for detailed error messages
3. Verify all environment variables are correctly set
4. Test locally first with production environment variables

## Version Information

- Node.js: v18+ required
- Express: v4.21.2
- Supabase: PostgreSQL database
- Session: express-session with in-memory store
