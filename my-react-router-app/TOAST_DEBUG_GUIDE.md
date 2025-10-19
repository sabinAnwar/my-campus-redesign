# Toast Notification Debugging Guide

## **How Toast Notifications Work:**

1. User submits form (login or password reset)
2. Form data sent to API endpoint via `fetcher.Form`
3. API processes request and returns JSON response
4. React component receives `fetcher.data`
5. Component calls `showSuccessToast()` or `showErrorToast()`
6. `react-toastify` displays toast notification

---

## **Check if Toast is Working:**

### **Step 1: Open Browser DevTools**
- Press **F12** or **Ctrl+Shift+I**
- Go to **Console** tab

### **Step 2: Look for Debug Logs**
When you submit a form, you should see:

```
✅ Showing success toast: ✅ Login successful! Redirecting...
```

or

```
❌ Showing error toast: Invalid email or password
```

### **Step 3: Check if Toast Appears**
- Look at **top-right corner** of page
- Green success toast = Working ✅
- Red error toast = Working ✅

---

## **Troubleshooting:**

### **Problem: No debug logs in console**
- API request might have failed
- Look for network errors in **Network** tab (F12)
- Check if `/api/login` returned a response

### **Problem: Debug logs show but no toast appears**
- Check if `ToastContainer` is in `root.jsx`
- Verify `react-toastify` CSS is imported
- Toast might be appearing outside visible area

### **Problem: API returns HTML instead of JSON**
- API endpoint not found
- Check `app/routes.js` for correct route configuration
- Verify `/api/login` route exists

### **Problem: Form doesn't submit**
- Check browser console for JavaScript errors
- Verify form has `method="post"` attribute
- Check `fetcher.Form` is used correctly

---

## **Manual Testing:**

### **Test 1: Login with Valid Credentials**
1. Navigate to: `http://localhost:5174/login`
2. Email: `sabin.elanwar@iu-study.org`
3. Password: `password123`
4. Click **"Sign in"**
5. **Expected:**
   - ✅ Toast shows "Login successful!"
   - ✅ Redirect to home page
   - ✅ Logs show "✅ Showing success toast"

### **Test 2: Login with Invalid Credentials**
1. Navigate to: `http://localhost:5174/login`
2. Email: `wrong@email.com`
3. Password: `wrongpassword`
4. Click **"Sign in"**
5. **Expected:**
   - ❌ Toast shows "Invalid email or password"
   - ❌ Stay on login page
   - ✅ Logs show "❌ Showing error toast"

### **Test 3: Password Reset**
1. Navigate to: `http://localhost:5174/reset-password`
2. Email: `sabinanwar2@gmail.com`
3. Click **"Send reset link"**
4. **Expected:**
   - ✅ Toast shows "Password reset email sent!"
   - ✅ Logs show "✅ Showing success toast"
   - ✅ Email arrives in Gmail inbox (within 5 seconds)

---

## **Console Commands for Testing:**

### **Check if fetch works:**
```javascript
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'email=sabin.elanwar@iu-study.org&password=password123'
}).then(r => r.json()).then(d => console.log(d))
```

### **Check if ToastContainer exists:**
```javascript
document.querySelector('.Toastify')
// Should return the toast container element
```

### **Manually show a test toast:**
```javascript
// Copy this into console:
import('react-toastify').then(m => m.toast.success('Test toast!', { position: 'top-right', autoClose: 3000 }))
```

---

## **Common Error Messages:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid email or password" | Wrong credentials | Use test credentials |
| "Please provide a valid email" | Email field empty | Fill in email field |
| "Please provide a password" | Password field empty | Fill in password field |
| "Failed to process login" | Server error | Check API logs |
| "No toast appears" | Toast not configured | Check `root.jsx` |
| "Redirects but no toast" | Redirect too fast | Increase timeout |

---

## **Files to Check:**

### **Toast Configuration:**
`app/lib/toast.js` - Toast function definitions

### **Login Component:**
`app/routes/login.jsx` - Login form logic

### **Password Reset Component:**
`app/routes/reset-password.jsx` - Password reset form logic

### **API Endpoints:**
`app/routes/api/login.jsx` - Login API
`app/routes/api/request-password-reset.jsx` - Password reset API

### **Root Layout:**
`app/root.jsx` - Must have `<ToastContainer />` and CSS import

### **Routes Configuration:**
`app/routes.js` - Must have `/api/login` and `/api/request-password-reset` routes

---

## **Quick Fixes:**

### **Fix: Toast not showing**
Add to `root.jsx` if missing:
```jsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// In Layout component:
<ToastContainer position="top-right" autoClose={3000} />
```

### **Fix: Redirect too fast**
In `login.jsx`, increase timeout:
```jsx
setTimeout(() => navigate('/'), 1500); // Increase from 800 to 1500
```

### **Fix: Debug logs not showing**
Make sure toast functions have console.log:
```jsx
export function showSuccessToast(message) {
  console.log('✅ Showing success toast:', message); // Add this
  toast.success(message, { ... })
}
```

---

## **Questions?**

1. Check browser console (F12)
2. Look for debug logs with emojis (✅ ❌ 📨)
3. Verify API response in Network tab
4. Check `/api/login` endpoint manually with curl
5. Verify `ToastContainer` is in `root.jsx`

**Everything should be working now!** 🎉
