# Deployment Guide for Bolt/StackBlitz

This guide explains how to deploy your application on Bolt/StackBlitz with session-based authentication.

## Environment Variables

Ensure the following environment variables are set in your Bolt project settings:

### Required for Backend
- `SESSION_SECRET` - A secure random string for session encryption
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NODE_ENV` - Set to `production` for production deployments

### Required for Frontend Build
- `VITE_SUPABASE_URL` - Your Supabase project URL (same as SUPABASE_URL)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key (same as SUPABASE_ANON_KEY)

## Deployment Steps

### 1. Build the Application

Before deploying, build the production assets:

```bash
npm run build
```

This creates optimized files in the `dist/public` directory.

### 2. Start Production Server

```bash
npm run start
```

This starts the Express server in production mode, which:
- Serves built static files from `dist/public`
- Enables CORS for Bolt domains
- Configures session cookies appropriately
- Handles API routes for authentication and data

### 3. Verify Deployment

After deployment, check the console logs for:
- Environment detection (should show "PRODUCTION")
- Bolt Environment detection
- Session configuration
- CORS status
- Supabase connection status

## Session Configuration

The application automatically adjusts session cookie settings based on the environment:

### Development Mode
- `secure`: false (allows HTTP)
- `sameSite`: 'lax'
- `proxy`: false

### Production (Bolt/StackBlitz)
- `secure`: false (Bolt handles HTTPS at the edge)
- `sameSite`: 'lax' (compatible with Bolt's architecture)
- `proxy`: true (trusts Bolt's proxy)
- `credentials`: included in all API requests

### Production (Traditional Hosting with HTTPS)
- `secure`: true (requires HTTPS)
- `sameSite`: 'none' (for cross-origin)
- `proxy`: true

## CORS Configuration

The application allows requests from:
- localhost (development)
- *.bolt.new (Bolt preview and production)
- *.stackblitz.io (StackBlitz domains)
- *.webcontainer.io (WebContainer domains)

All requests include credentials for session cookies to work.

## Troubleshooting

### Login Not Working

1. **Check Browser Console**
   - Look for CORS errors
   - Check for network errors
   - Verify cookies are being set

2. **Check Server Logs**
   - Verify environment is detected correctly
   - Check session configuration
   - Look for authentication errors

3. **Common Issues**
   - Cookies blocked by browser: Enable third-party cookies or use the same domain
   - Environment variables missing: Verify all required vars are set
   - Build not created: Run `npm run build` before starting production server

### Session Not Persisting

1. Check cookie settings in browser DevTools (Application > Cookies)
2. Verify session cookie is being sent with requests (Network tab > Request Headers)
3. Check server logs for session ID tracking

### Backend Not Accessible

1. Verify the backend server is running
2. Check that API routes return proper responses
3. Test with: `curl http://localhost:5000/api/auth/check`

## Admin Credentials

Default admin credentials (configured in Supabase):
- Username: admin
- Password: (check your Supabase `admins` table or migration files)

**Important**: Change default credentials in production!

## Security Notes

1. Always use a strong, random `SESSION_SECRET` in production
2. Change default admin credentials after first deployment
3. Keep environment variables secure and never commit them to version control
4. Use HTTPS in production (Bolt handles this automatically)
5. Regularly update dependencies for security patches

## Support

For issues specific to Bolt/StackBlitz deployment, refer to:
- [Bolt Documentation](https://bolt.new/docs)
- [StackBlitz Documentation](https://developer.stackblitz.com/)

For application-specific issues, check the main README.md file.
