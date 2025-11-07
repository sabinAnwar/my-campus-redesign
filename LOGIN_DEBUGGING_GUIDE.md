# Login Navigation - Debugging Guide

## Quick Diagnosis

If you're still experiencing login issues after the fixes, use this guide to diagnose the problem.

---

## Browser Developer Tools Checklist

### 1. Network Tab
Open DevTools → Network tab → Try to login

**✅ Look for:**
- `POST /api/login` request with 200 status
- Response body contains `{"success": true}`
- `Set-Cookie` header in response
- Session cookie is being set in browser

**❌ If not seeing this:**
- Check server logs for errors
- Verify database connection
- Check credentials in database

### 2. Cookies Tab
Open DevTools → Application → Cookies → `http://localhost:5174`

**✅ After login, you should see:**
- Cookie named `session` with a long UUID value
- Domain: `localhost` (or your domain)
- Path: `/`
- Expires: 7 days from now
- HttpOnly: ✅ (checked)
- Secure: ❌ (unchecked on localhost, ✅ on production)
- SameSite: Lax

**❌ If cookie is missing:**
- The `Set-Cookie` header might not be received
- Browser might be blocking cookies
- Check cookie domain settings

### 3. Console Tab
Open DevTools → Console

**✅ Expected logs:**
```
📝 /api/login content-type: application/x-www-form-urlencoded;charset=UTF-8
✅ Login successful for: sabin.elanwar@iu-study.org
🍪 Set-Cookie header set successfully
✅ Showing success toast: Login successful! Redirecting...
```

**❌ If seeing errors:**
- Check the error messages
- Look for fetch failures
- Verify API endpoint is accessible

---

## Server-Side Debugging

### Check 1: Login Action Logs

Watch the server console while logging in:

```bash
npm run dev
# Try to login in browser
# Look for logs on the server
```

**✅ Expected output:**
```
📝 /api/login content-type: application/x-www-form-urlencoded;charset=UTF-8
✅ Login successful for: sabin.elanwar@iu-study.org
🍪 Set-Cookie header set successfully
```

**❌ Troubleshoot:**
- If you don't see these logs, the request isn't reaching the server
- Check that `/api/login` is the correct endpoint
- Verify request method is POST

### Check 2: Database Session Creation

Add this temporary debug code to `app/routes/api/login.jsx`:

```javascript
// After prisma.session.create()
const createdSession = await prisma.session.create({
  data: {
    token: sessionToken,
    userId: user.id,
    expiresAt,
  },
});
console.log("✅ Session created in DB:", {
  token: createdSession.token,
  userId: createdSession.userId,
  expiresAt: createdSession.expiresAt,
});
```

**Expected output:**
```
✅ Session created in DB: {
  token: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  userId: 'user123',
  expiresAt: 2025-11-10T...
}
```

### Check 3: User Fetch Logs

Watch the `/api/user` endpoint:

```bash
npm run dev
# Login successfully
# Check console for these logs
```

**✅ Expected output:**
```
🔎 /api/user headers { cookie: 'session=...', xSession: null }
🔑 /api/user resolved token: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
🗄️ /api/user session lookup true has-user
```

**❌ If token is null:**
- Cookie not being sent with request
- Add `credentials: "include"` to fetch
- Check cookie settings

---

## Step-by-Step Manual Test

### Test 1: Can You Login?

```bash
curl -X POST http://localhost:5174/api/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=sabin.elanwar@iu-study.org&password=your_password" \
  -v
```

**✅ Should return:**
```
HTTP/1.1 200 OK
Set-Cookie: session=...; Path=/; Max-Age=604800; SameSite=Lax; HttpOnly

{"success":true,"message":"Login successful"}
```

**❌ If returning error:**
- Check credentials in database
- Verify user exists
- Check password hash

### Test 2: Can You Get User Info?

First, login and get the session cookie:

```bash
# Save cookies to file
curl -c cookies.txt -X POST http://localhost:5174/api/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=sabin.elanwar@iu-study.org&password=your_password"

# Use cookies to fetch user
curl -b cookies.txt http://localhost:5174/api/user -v
```

**✅ Should return:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user": {
    "id": "user123",
    "name": "Sabin",
    "email": "sabin.elanwar@iu-study.org"
  }
}
```

**❌ If returning 401:**
- Session token not found in database
- Cookie not being sent
- Session expired

---

## Common Issues & Fixes

### Issue 1: "Login returns success but no redirect"

**Symptom:** Console shows "Login successful! Redirecting..." but page doesn't change

**Fix:**
1. Check browser console for JavaScript errors
2. Verify `navigate` function is working
3. Try manually navigating: `window.location.href = "/dashboard"`

### Issue 2: "Session cookie not being sent"

**Symptom:** `/api/user` returns 401 after login

**Fix:**
1. Ensure `credentials: "include"` is in fetch
2. Check browser cookie settings
3. Verify domain matches

**Code:**
```javascript
// ❌ Wrong - cookies not sent
fetch("/api/user")

// ✅ Correct - cookies sent
fetch("/api/user", { credentials: "include" })
```

### Issue 3: "Set-Cookie header ignored"

**Symptom:** Cookie not appearing in DevTools → Cookies tab

**Fix:**
1. Check browser is allowing third-party cookies (if on different domain)
2. Verify SameSite setting (use `Lax` for dev)
3. Check if running on localhost vs IP address
4. Try different browser to rule out cookie storage issues

**For localhost development:**
```javascript
// Development cookie settings
const parts = [
  `session=${sessionToken}`,
  "Path=/",
  `Max-Age=${7 * 24 * 60 * 60}`,
  "SameSite=Lax",  // ← Important for dev
  // "Secure", ← Only for HTTPS
];
```

### Issue 4: "Dashboard loads but showing error"

**Symptom:** Dashboard page loads but shows "Loading..." forever or error

**Fix:**
1. Check browser console for errors
2. Open DevTools → Network tab
3. Look for failed `/api/user` request
4. Check response status and body

**Debug code in dashboard:**

```javascript
useEffect(() => {
  const fetchUser = async () => {
    console.log("📝 Fetching user...");
    try {
      const response = await fetch("/api/user", {
        credentials: "include",
      });
      console.log("📊 Response status:", response.status);
      console.log("📊 Response ok:", response.ok);
      
      const data = await response.json();
      console.log("📊 Response data:", data);
      
      if (response.ok) {
        setUser(data.user);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchUser();
}, [navigate]);
```

---

## Production Debugging

### Enable Production Logging

Add this to `api/index.js`:

```javascript
// Add debug logging
if (process.env.DEBUG === "1") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);
    next();
  });
}
```

Run with:
```bash
DEBUG=1 npm start
```

### Check Environment Variables

Verify these are set:

```bash
# .env or environment
SESSION_SECRET=your-secret-here
COOKIE_DOMAIN=your-domain.com
NODE_ENV=production
```

---

## Performance Tips

### Monitor Login Latency

Add timing to debug:

```javascript
const handleSubmit = async (e) => {
  const startTime = performance.now();
  
  // ... login logic ...
  
  const endTime = performance.now();
  console.log(`⏱️ Login took ${endTime - startTime}ms`);
};
```

**Expected:**
- Network latency: 100-500ms
- Database query: 10-50ms
- Total: < 1000ms

If slower, check:
- Database performance
- Network latency
- Server CPU/memory

---

## Reset & Start Fresh

If you're stuck, try this:

```bash
# 1. Stop the server
# Press Ctrl+C in terminal

# 2. Clear local storage (in browser console)
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

# 3. Delete database sessions (if using Prisma)
npm run prisma studio
# In Prisma Studio: delete all sessions for your user

# 4. Restart server
npm run dev

# 5. Try login again
```

---

## Still Having Issues?

Check:
1. **Server logs** - Is the request reaching the server?
2. **Browser console** - Any JavaScript errors?
3. **Network tab** - What's the response status/body?
4. **Database** - Is session being created?
5. **Cookies** - Is cookie being set and sent?

Share these details for faster debugging!
