# Bolt Deployment Checklist

Use this checklist before and after publishing to Bolt to ensure login works correctly.

## Pre-Deployment Checklist

### 1. Build the Application
- [ ] Run `npm run build` successfully
- [ ] Verify `dist/public` directory is created
- [ ] Check that `dist/public/index.html` exists

### 2. Environment Variables
Set these in your Bolt project's environment settings:

#### Backend Variables
- [ ] `SESSION_SECRET` - Generate a secure random string (32+ characters)
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- [ ] `NODE_ENV=production` - Set to production

#### Frontend Build Variables (same values as backend)
- [ ] `VITE_SUPABASE_URL` - Same as SUPABASE_URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Same as SUPABASE_ANON_KEY

### 3. Verify Database Setup
- [ ] Supabase project is created and accessible
- [ ] Migrations have been applied (check `admins` table exists)
- [ ] Admin user is created with credentials you know
- [ ] RLS policies are enabled and working

### 4. Code Verification
- [ ] CORS is configured in `server/index.ts`
- [ ] Session cookies are set to work with Bolt
- [ ] Production server setup is in `server/vite.ts`
- [ ] Auth requests include `credentials: 'include'`

## Generate SESSION_SECRET

Run this command to generate a secure session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and set it as `SESSION_SECRET` in Bolt environment variables.

## Deployment Steps

### 1. Publish to Bolt
- [ ] Click the "Publish" button in Bolt
- [ ] Wait for deployment to complete
- [ ] Note your published URL

### 2. Test the Published Site
- [ ] Visit your published URL
- [ ] Open browser DevTools (F12)
- [ ] Click "Admin Login" button
- [ ] Enter admin credentials
- [ ] Submit login form

### 3. Check for Success

#### Browser Console (F12 > Console)
- [ ] No CORS errors
- [ ] No network errors
- [ ] Auth check completes successfully

#### Browser DevTools (F12 > Application > Cookies)
- [ ] Cookie named `rutgers.chess.session` is present
- [ ] Cookie has an HttpOnly flag
- [ ] Cookie has a valid expiration date

#### Network Tab (F12 > Network)
- [ ] POST to `/api/auth/login` returns 200 status
- [ ] Response includes `{"success":true}`
- [ ] Cookie is set in response headers
- [ ] Subsequent requests include the cookie

## Troubleshooting

### Login Button Doesn't Respond
- Check browser console for JavaScript errors
- Verify the site has fully loaded
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### "Login Failed" Error
- Verify admin credentials are correct
- Check Supabase `admins` table for the user
- Ensure password is hashed correctly (bcrypt)
- Check server logs in Bolt console

### "Connection Error" Message
- Backend server may not be running
- Check Bolt deployment logs
- Verify all environment variables are set
- Try redeploying the application

### Cookie Not Being Set
- Check browser's cookie settings (allow cookies)
- Verify `Set-Cookie` header in Network tab
- Check if browser blocks cookies
- Try in an incognito/private window

### Session Doesn't Persist
- Check cookie expiration date
- Verify SESSION_SECRET is set consistently
- Check if cookie is HttpOnly and SameSite is 'lax'
- Clear cookies and try again

## Post-Deployment Verification

### Admin Panel Access
- [ ] Can log in successfully
- [ ] Can access admin features
- [ ] Can create/edit events
- [ ] Can manage sponsors
- [ ] Can update content

### Session Persistence
- [ ] Refresh the page - still logged in
- [ ] Close and reopen browser tab - still logged in
- [ ] Navigate to different pages - still logged in
- [ ] Wait 5 minutes - still logged in

### Logout Functionality
- [ ] Click "Admin Logout"
- [ ] Redirected to public view
- [ ] Admin features are hidden
- [ ] Cookie is removed from browser

## Security Post-Deployment

### Immediate Actions
- [ ] Change default admin password if using default
- [ ] Verify SESSION_SECRET is strong and unique
- [ ] Test that non-admin users cannot access admin features
- [ ] Check that API routes require authentication

### Regular Maintenance
- [ ] Review admin access logs
- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Rotate SESSION_SECRET periodically

## Support Resources

- **Bolt Help**: https://bolt.new/help
- **Supabase Docs**: https://supabase.com/docs
- **Express Sessions**: https://github.com/expressjs/session
- **CORS Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

## Quick Reference Commands

```bash
# Build for production
npm run build

# Start production server locally
npm run start

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check if build exists
ls -la dist/public/

# Test API endpoint locally
curl http://localhost:5000/api/auth/check
```

## Notes

- Keep this checklist for future deployments
- Update it as you discover new issues or solutions
- Share with team members who deploy
- Document any custom modifications you make
