# Login Flow Guide - Vercel Deployment

## How Login Works on Vercel

When you login at `https://iu-mycampus.me/login`:

### Step 1: Form Submission
- User enters email and password
- Clicks "Sign in" button
- Form sends **POST request** to `/api/login` with form-encoded data
- URL stays at `/login` (does NOT add query params)

### Step 2: Server Response
The `/api/login` endpoint (Express server) responds with:

**Success:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "sabin.elanwar@iu-study.org",
    "username": "sabin_elanwar",
    "name": "Sabin Elanwar"
  }
}
```

**Failure:**
```json
{
  "error": "Invalid email or password"
}
```

### Step 3: Client Handling
1. Toast notification appears (success or error)
2. On success:
   - Cookie `auth_session` is set (HttpOnly, Secure)
   - After 1.5 seconds, page redirects to `/`
   - User sees homepage

3. On error:
   - Error message displayed in form
   - User stays on login page
   - Can retry

## What to Do on Vercel

### 1. Update Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_AWQiIa1FDEJ4@ep-flat-dust-ad3j6oz3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
EMAIL_USER=sabinanwar2@gmail.com
EMAIL_PASSWORD=hiublrnfmdvlrqgm
```

### 2. Deploy

```bash
git add -A
git commit -m "Update login form with better error handling"
git push origin main
```

Vercel will automatically redeploy.

### 3. Test Login

Visit: `https://iu-mycampus.me/login`

Enter:
- Email: `sabin.elanwar@iu-study.org`
- Password: `password123`

Click "Sign in"

### 4. Expected Behavior

✅ **Success:**
- Toast notification: "✅ Login successful! Redirecting..."
- Redirect to homepage `/`
- Auth session cookie set

❌ **Failure:**
- Toast notification: "Invalid email or password"
- Error message shown in form
- Stay on login page

## Why NOT Showing Query Params

The URL should **NOT** show:
```
❌ https://iu-mycampus.me/login?email=sabin.elanwar%40iu-study.org&password=password123
```

Instead it should:
```
✅ Stay at https://iu-mycampus.me/login
```

If you see query params, it means:
- The form is NOT using the correct form submission method
- Or the page is loading with query params on initial load

## Key Changes Made

1. **Simplified form submission**: Using `fetch()` directly instead of React Router's form actions
2. **Better error handling**: Console logs show exactly what's happening
3. **Session persistence**: Cookies are automatically included (`credentials: 'include'`)
4. **Clear redirect**: Uses `window.location.href` instead of React Router navigate (more reliable)
5. **Toast notifications**: Show before redirecting so user sees feedback

## Troubleshooting

If login still shows query params in URL:

1. **Clear browser cache**: Ctrl+Shift+Delete → Clear cache
2. **Check console**: Open DevTools → Console tab
3. **Look for errors**: Any red messages?
4. **Test API directly**:
   ```bash
   curl -X POST "https://iu-mycampus.me/api/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "email=sabin.elanwar@iu-study.org&password=password123"
   ```

If API returns valid JSON, the issue is frontend. If it returns HTML/error, it's backend.
