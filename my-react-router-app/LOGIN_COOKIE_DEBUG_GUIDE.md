# 🔧 Login Cookie Debugging Guide

## ✅ What I Fixed:

### 1. **Improved Logging**
- Added detailed console logs throughout login flow
- Shows cookie values at each step
- Displays response headers for debugging

### 2. **Better Error Handling**
- Dashboard now properly redirects on 401 errors
- Network errors trigger redirect to login
- Stale cookies are cleared before redirect

### 3. **Cookie Debugging**
- Login page logs cookies after successful login
- Dashboard logs authentication status
- Better error messages

---

## 🔍 How to Debug Cookie Issues:

### Step 1: Open Browser DevTools

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Clear the console (trash icon)

### Step 2: Try Logging In

1. Go to `/login`
2. Enter credentials: `sabin.elanwar@iu-study.org`
3. Watch the console output

**You should see:**
```
🔐 Login: Submitting credentials for: sabin.elanwar@iu-study.org
📡 Login: Response status: 200
🍪 Login: Response headers: { ... }
✅ Login: Success response: { success: true, ... }
🍪 Login: Cookies after login: session=xxx-xxx-xxx; ...
🔄 Login: Navigating to dashboard
```

### Step 3: Check Dashboard

**You should see:**
```
🔍 Dashboard: Fetching user...
📡 Dashboard: Response status: 200
✅ Dashboard: User data received: { user: { ... } }
```

**If you see 401:**
```
📡 Dashboard: Response status: 401
❌ Dashboard: User not authenticated (401), redirecting to login
```

---

## 🍪 Check Cookies Manually:

### In DevTools:

1. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Click **Cookies** → `http://localhost:5174`
3. Look for `session` cookie

**Should see:**
- **Name**: `session`
- **Value**: UUID (e.g., `abc123-def456-...`)
- **Path**: `/`
- **HttpOnly**: ✅ (checkmark)
- **Secure**: ❌ (only in production)
- **SameSite**: `Lax`

---

## ❌ Common Issues & Fixes:

### Issue 1: Cookie Not Set After Login

**Symptoms:**
- Login says "successful"
- But dashboard redirects back to login
- No `session` cookie in DevTools

**Fix:**
Check console for:
```
🍪 Login: Cookies after login: 
```

If empty, the cookie wasn't set. Check:
1. Response has `Set-Cookie` header
2. No CORS errors in console
3. `credentials: "include"` in fetch call

### Issue 2: Cookie Set But Not Sent

**Symptoms:**
- Cookie visible in DevTools
- But `/api/user` returns 401
- Console shows: `🔑 /api/user resolved token null`

**Fix:**
1. Check cookie **Domain** - should match your URL
2. Check cookie **Path** - should be `/`
3. Check **SameSite** - should be `Lax` or `None`
4. Restart browser (hard refresh: Ctrl+Shift+R)

### Issue 3: Session Expired

**Symptoms:**
- Was logged in, now redirected to login
- No error message

**Fix:**
Sessions expire after 7 days. Normal behavior. Just log in again.

### Issue 4: Database Session Not Found

**Symptoms:**
- Cookie exists
- Console shows: `🗄️ /api/user session lookup false no-user`

**Fix:**
```bash
# Check database has sessions
npx prisma studio

# Go to Session table
# Verify session with your token exists
```

If session missing, database was cleared. Log in again.

---

## 🔧 Testing in Different Scenarios:

### Test 1: Fresh Login
```bash
# Clear all cookies
1. DevTools → Application → Cookies → Clear all
2. Go to /login
3. Enter credentials
4. Should redirect to /dashboard
```

### Test 2: Existing Session
```bash
# Keep cookies
1. Close tab
2. Open new tab
3. Go to /dashboard directly
4. Should load without login
```

### Test 3: Expired Session
```bash
# Manually expire session in database
1. Open Prisma Studio: npx prisma studio
2. Go to Session table
3. Change expiresAt to yesterday
4. Refresh /dashboard
5. Should redirect to /login
```

---

## 📊 Production Debugging (Vercel):

### View Logs:
```bash
# In Vercel dashboard
1. Go to your project
2. Click "Logs" tab
3. Filter by "/api/login" or "/api/user"
```

### Common Production Issues:

**Issue: Cookies not working on Vercel**

Check:
1. `Secure` flag is set (HTTPS required)
2. `Domain` matches your Vercel domain
3. No CORS issues (check browser console)

**Fix:**
```env
# In Vercel environment variables
COOKIE_DOMAIN=your-app.vercel.app
NODE_ENV=production
```

---

## 🚀 Next Steps:

1. **Test the login flow** with console open
2. **Check cookies** in Application tab
3. **Report what you see** in console logs
4. I'll help debug further if needed!

---

## 📝 Quick Reference:

| Endpoint | Purpose | Cookie Required | Returns |
|----------|---------|-----------------|---------|
| `POST /api/login` | Login | No | Sets cookie |
| `GET /api/user` | Get user | Yes | User data or 401 |
| `POST /api/logout` | Logout | Yes | Clears cookie |

**Cookie Flow:**
```
1. User submits login form
2. POST /api/login validates credentials
3. Creates session in database
4. Returns Set-Cookie header
5. Browser stores cookie
6. All future requests include cookie
7. GET /api/user validates cookie → session → user
```

---

**Let me know what you see in the console and I'll help debug!** 🔍
