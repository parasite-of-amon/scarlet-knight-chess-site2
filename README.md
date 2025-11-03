# Rutgers Chess Club Website

A full-stack web application for the Rutgers Chess Club featuring event management, sponsor integration, and admin controls.

## Quick Links

- **Quick Deployment**: See `QUICK_DEPLOY_GUIDE.md` for 10-minute setup
- **Netlify Deployment**: See `NETLIFY_DEPLOYMENT.md` for complete guide
- **Admin Guide**: See `ADMIN_GUIDE.md` for admin panel usage
- **Database**: See `DATABASE.md` for schema information

## Tech Stack

- **Frontend**: React, Vite, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js, express-session
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Split architecture (Netlify + Railway/Render)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```bash
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-key>
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-key>
   SESSION_SECRET=<generate-random-string>
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5000

## Production Deployment

This project uses a split deployment architecture:
- **Frontend** (static): Deploy to Netlify
- **Backend** (API): Deploy to Railway, Render, or Fly.io

See `QUICK_DEPLOY_GUIDE.md` for step-by-step instructions.

## Admin Access

Default credentials:
- Username: `administrator`
- Password: `RutgersChess@123`

Change these after first login in production!

## Documentation

- `QUICK_DEPLOY_GUIDE.md` - Fast deployment setup (start here!)
- `NETLIFY_DEPLOYMENT.md` - Complete Netlify deployment guide
- `NETLIFY_FIX_SUMMARY.md` - Why split architecture was needed
- `ARCHITECTURE.md` - System architecture with diagrams
- `ADMIN_GUIDE.md` - Admin panel documentation
- `DEPLOYMENT_GUIDE.md` - Alternative deployment options
- `DATABASE.md` - Database schema and setup

## Deployment Architecture

This project uses a split deployment:
- **Frontend** (Netlify): Static React app served from global CDN
- **Backend** (Railway/Render): Express.js API server with sessions
- **Database** (Supabase): PostgreSQL with Row Level Security

See `ARCHITECTURE.md` for detailed diagrams and explanations.
