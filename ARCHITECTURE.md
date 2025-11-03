# Architecture Overview

## Deployment Architecture (Netlify + Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                           │
│                                                                 │
│  React App (JavaScript runs in browser)                        │
│  - Displays UI                                                  │
│  - Makes API calls to backend                                  │
│  - Stores session cookies                                      │
└────────────────┬────────────────────────────┬───────────────────┘
                 │                            │
                 │ GET /                      │ POST /api/auth/login
                 │ (HTML/CSS/JS)              │ (JSON)
                 ↓                            ↓
     ┌──────────────────────┐    ┌──────────────────────────┐
     │  NETLIFY (Frontend)  │    │  RAILWAY/RENDER (Backend)│
     │                      │    │                          │
     │  Static Files:       │    │  Express.js Server:      │
     │  - index.html        │    │  - /api/auth/*          │
     │  - React bundle      │    │  - /api/events/*        │
     │  - CSS files         │    │  - /api/sponsors/*      │
     │  - Images            │    │  - Session management   │
     │                      │    │  - Authentication       │
     │  CDN: Fast global    │    │  CORS: Allows Netlify   │
     │  delivery            │    │  domain                 │
     └──────────────────────┘    └───────────┬──────────────┘
                                             │
                                             │ SQL Queries
                                             ↓
                                 ┌────────────────────────┐
                                 │  SUPABASE (Database)   │
                                 │                        │
                                 │  PostgreSQL:           │
                                 │  - admins table        │
                                 │  - events table        │
                                 │  - sponsors table      │
                                 │  - page_content table  │
                                 │                        │
                                 │  RLS Policies:         │
                                 │  - Row Level Security  │
                                 │  - Admin-only writes   │
                                 └────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│ Browser  │                                    │ Backend  │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │ 1. POST /api/auth/login                      │
     │    { username, password }                    │
     ├──────────────────────────────────────────────>
     │                                               │
     │                                2. Verify with Supabase
     │                                               ├────────> Supabase
     │                                               │          admins table
     │                                               <────────┤
     │                                               │
     │                                3. Create session
     │                                   req.session.adminId = id
     │                                               │
     │ 4. Set-Cookie: rutgers.chess.session=abc123  │
     │    { success: true }                          │
     <──────────────────────────────────────────────┤
     │                                               │
     │ 5. Store cookie (automatic)                  │
     │                                               │
     │ 6. GET /api/events/unified                   │
     │    Cookie: rutgers.chess.session=abc123      │
     ├──────────────────────────────────────────────>
     │                                               │
     │                                7. Check session
     │                                   req.session.adminId exists?
     │                                               │
     │ 8. Return data                               │
     <──────────────────────────────────────────────┤
     │                                               │
```

## Local Development vs Production

### Local Development (Single Server)

```
┌──────────────────────────────────────┐
│  http://localhost:5000               │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Express Server (tsx watch)    │ │
│  │                                │ │
│  │  Serves:                       │ │
│  │  - Vite dev server (frontend) │ │
│  │  - API routes (backend)       │ │
│  │                                │ │
│  │  API calls: /api/*             │ │
│  │  (same origin, no CORS)       │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Production (Split Deployment)

```
Frontend:                         Backend:
https://your-site.netlify.app    https://your-app.railway.app
┌──────────────────────────┐    ┌─────────────────────────┐
│  Netlify CDN             │    │  Railway/Render Server  │
│  - Static files          │    │  - Express.js           │
│  - React build           │    │  - API routes          │
│                          │    │  - Sessions            │
│  API calls go to:        │    │                         │
│  VITE_API_URL →──────────┼────┤  Allows origin:        │
│                          │    │  FRONTEND_URL          │
└──────────────────────────┘    └─────────────────────────┘
```

## Environment Variables Flow

### Build Time (Netlify)

```
.env → VITE_API_URL=https://backend.railway.app
        ↓
      Vite Build
        ↓
   JavaScript bundle includes:
   const API_BASE_URL = "https://backend.railway.app"
        ↓
   dist/public/assets/index-xyz.js
        ↓
   Deployed to Netlify CDN
```

### Runtime (Express Server)

```
.env → SESSION_SECRET, SUPABASE_URL, etc.
        ↓
   Express server reads on startup
        ↓
   Configures middleware:
   - CORS with FRONTEND_URL
   - Session with SESSION_SECRET
   - Supabase client with credentials
        ↓
   Listens on port 5000
        ↓
   Handles API requests
```

## Data Flow - Example: Creating an Event

```
1. Admin opens form in browser (Netlify frontend)
   ↓
2. Fills in event details
   ↓
3. Clicks "Save"
   ↓
4. Frontend: POST /api/events/unified
   - URL: https://backend.railway.app/api/events/unified
   - Headers: Cookie (session), Content-Type: application/json
   - Body: { title, date, description, ... }
   ↓
5. Backend: Receives request
   - Checks session: req.session.adminId exists?
   - If no: return 401 Unauthorized
   - If yes: continue
   ↓
6. Backend: Validates data with Zod schema
   ↓
7. Backend: Calls Supabase
   - SQL: INSERT INTO events (...)
   - Returns new event with ID
   ↓
8. Backend: Returns JSON response
   - Status: 200 OK
   - Body: { id, title, date, ... }
   ↓
9. Frontend: Receives response
   - Updates UI with new event
   - Shows success message
   ↓
10. React Query: Invalidates cache
    - Refetches event list
    - UI updates automatically
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│ 1. HTTPS (Transport Security)               │
│    - Netlify: Automatic SSL                 │
│    - Railway: Automatic SSL                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. CORS (Cross-Origin Security)             │
│    - Backend only allows Netlify domain     │
│    - Credentials required                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. Session Authentication                   │
│    - HttpOnly cookies (XSS protection)      │
│    - Secure flag (HTTPS only)              │
│    - SameSite: none (cross-origin)         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 4. Route Authorization                      │
│    - Check req.session.adminId             │
│    - Return 401 if not admin               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 5. Input Validation                         │
│    - Zod schemas validate all input        │
│    - Prevent SQL injection                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 6. Row Level Security (RLS)                 │
│    - Supabase policies enforce access      │
│    - Double layer of protection            │
└─────────────────────────────────────────────┘
```

## Why This Architecture?

### Why Split Deployment?

**Netlify Limitation**: Static hosting only, no Node.js backend
- ❌ Cannot run Express server
- ❌ Cannot maintain sessions in memory
- ❌ No persistent server processes

**Solution**: Separate backend on platform that supports Node.js
- ✅ Railway/Render support full Node.js apps
- ✅ Express server runs continuously
- ✅ Sessions work normally
- ✅ Minimal code changes needed

### Why Not Serverless Functions?

**Serverless (Netlify Functions)** would require:
- Converting 20+ Express routes to individual functions
- Replacing session-based auth with JWT tokens
- Refactoring middleware and error handling
- Testing and debugging serverless-specific issues

**Current approach** (split deployment):
- ✅ Zero backend code changes
- ✅ Keep session-based authentication
- ✅ Faster implementation
- ✅ Easier debugging and logs

### Performance Benefits

1. **Frontend (Netlify CDN)**
   - Global edge network
   - Fast static asset delivery
   - Automatic HTTPS/SSL
   - DDoS protection

2. **Backend (Railway/Render)**
   - Dedicated server resources
   - No cold starts for API
   - WebSocket support (if needed)
   - Better for long-running processes

3. **Database (Supabase)**
   - Managed PostgreSQL
   - Automatic backups
   - Connection pooling
   - Built-in RLS

## Scaling Considerations

### Current Setup (Good for 1-1000 users)
- Netlify: 100GB bandwidth/month (free)
- Railway: Single instance, auto-scaling
- Supabase: Free tier, 500MB database

### If You Grow (1000+ users)
1. **Upgrade Railway**: More resources, multiple regions
2. **Add Redis**: For session storage (instead of memory)
3. **CDN**: Already have it (Netlify)
4. **Database**: Upgrade Supabase plan
5. **Monitoring**: Add New Relic, DataDog, etc.

### Horizontal Scaling Path
```
Current:     Netlify → Single Railway Instance → Supabase

Future:      Netlify → Load Balancer
                         ├─> Railway Instance 1 ──┐
                         ├─> Railway Instance 2 ──┼─> Redis Session Store
                         └─> Railway Instance 3 ──┘       ↓
                                                      Supabase
```

## Cost Breakdown

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Netlify | 100GB bandwidth | $19/mo (Pro) |
| Railway | $5 credit/mo | $20/mo typical |
| Render | 750 hrs/mo | $7/mo (starter) |
| Supabase | 500MB DB | $25/mo (Pro) |

**Total**: $0-5/month for most small sites

## Comparison with Other Architectures

### 1. Monolith (Single Server)
```
Pros: Simple, all in one place
Cons: Can't use Netlify, harder to scale
Platforms: Railway, Render, Heroku, DigitalOcean
```

### 2. Serverless (Netlify Functions)
```
Pros: One platform, auto-scaling
Cons: Complex migration, cold starts, JWT required
Platforms: Netlify, Vercel, AWS Lambda
```

### 3. Split (Current Approach)
```
Pros: Best of both worlds, minimal changes
Cons: Two deployments to manage
Platforms: Netlify + Railway/Render
```

### 4. Full Cloud (Advanced)
```
Pros: Enterprise-grade, unlimited scale
Cons: Complex, expensive, overkill for small sites
Platforms: AWS (EC2, RDS, CloudFront, etc.)
```

## Monitoring and Debugging

### Frontend (Netlify)
- **Deploy logs**: Netlify dashboard
- **Runtime errors**: Browser DevTools console
- **Network issues**: Browser DevTools network tab

### Backend (Railway/Render)
- **Server logs**: Platform dashboard
- **API errors**: Structured logging in Express
- **Database queries**: Supabase dashboard logs

### Database (Supabase)
- **Query performance**: Supabase SQL editor
- **Table data**: Supabase table editor
- **RLS policies**: Supabase authentication logs

## Troubleshooting Decision Tree

```
Login not working?
├─> Check browser console
│   ├─> CORS error? → Check FRONTEND_URL on backend
│   ├─> 404 error? → Check VITE_API_URL on Netlify
│   └─> Other error? → Check backend logs
│
├─> Check Network tab
│   ├─> Request failing? → Backend may be down
│   ├─> Cookie not set? → Check session config
│   └─> Wrong URL? → Check VITE_API_URL
│
└─> Check backend logs
    ├─> Session save error? → Check SESSION_SECRET
    ├─> Database error? → Check Supabase config
    └─> Auth error? → Check admin credentials
```

## Summary

This architecture splits your application into three independent services:
1. **Netlify** - Fast, global frontend delivery
2. **Railway/Render** - Reliable backend API server
3. **Supabase** - Managed PostgreSQL database

Each service does what it does best, resulting in a scalable, maintainable, and cost-effective deployment strategy.
