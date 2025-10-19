# IU Student Portal - Login & Password Reset Guide

## Quick Start

### 1. Start the Dev Server
```bash
npm run dev
```

The server will run on **http://localhost:5173**

---

## **Test Accounts**

Use these credentials to test the login:

| Email | Password | Role |
|-------|----------|------|
| `sabin.elanwar@iu-study.org` | `password123` | STUDENT |
| `student@iu.edu` | `password123` | STUDENT |
| `sabinanwar6@gmail.com` | `Test@1234` | STUDENT |
| `admin@iu.edu` | `admin123` | ADMIN |

---

## **Login Flow**

### Route: `/login`

1. **Navigate to**: http://localhost:5173/login
2. **Enter credentials**:
   - Email: `sabin.elanwar@iu-study.org`
   - Password: `password123`
3. **Click "Sign in"**
4. **Success!** You'll see:
   - ✅ Green success toast notification at top-right
   - ✅ Redirect to home page (`/`)

### What Happens Behind the Scenes

```
1. Form submits to POST /api/login
2. Server validates email/password against database
3. Password is compared using bcryptjs
4. Session cookie is created and set
5. Success response returned
6. Client redirects to home page
```

---

## **Password Reset Flow**

### Step 1: Request Reset
**Route**: `/reset-password`

1. **Navigate to**: http://localhost:5173/reset-password
2. **Enter email**: `sabin.elanwar@iu-study.org`
3. **Click "Send reset link"**
4. **Success!** You'll see:
   - ✅ Green success toast notification
   - ✅ A blue development link button (for testing)
   - ✅ Email would be sent to Ethereal (dev mode)

### Step 2: Reset Password
**Route**: `/reset-password/:token`

1. **Click the development link** on the previous page, OR
2. **Manually navigate** to: http://localhost:5173/reset-password/{token}
3. **Enter new password** twice
4. **Click "Reset password"**
5. **Success!** You'll be redirected to login

---

## **API Endpoints**

### Health Check
```bash
curl http://localhost:5173/api/health
# Response: { "ok": true }
```

### Login
```bash
curl -X POST http://localhost:5173/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sabin.elanwar@iu-study.org","password":"password123"}'

# Response: 
# {
#   "success": true,
#   "user": {
#     "id": 1,
#     "email": "sabin.elanwar@iu-study.org",
#     "username": "sabin_elanwar",
#     "name": "Sabin Elanwar"
#   }
# }
```

### Request Password Reset
```bash
curl -X POST http://localhost:5173/api/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"sabin.elanwar@iu-study.org"}'

# Response (in dev mode):
# {
#   "success": true,
#   "message": "If an account exists with this email...",
#   "resetLink": "http://localhost:5173/reset-password/uuid-token",
#   "resetToken": "uuid-token"
# }
```

---

## **Testing Checklist**

- [ ] **Login works** - Can log in with test credentials
- [ ] **Success toast appears** - Green notification shows after login
- [ ] **Redirects to home** - Redirected to `/` after successful login
- [ ] **Password reset works** - Can request password reset
- [ ] **Reset toast appears** - Green notification shows after reset request
- [ ] **Reset link generated** - Blue button appears with development link
- [ ] **Invalid credentials rejected** - Error toast shows with wrong password
- [ ] **Invalid email rejected** - Error toast shows with non-existent email

---

## **Troubleshooting**

### Issue: "No toast notification appears"
**Solution**: Make sure `react-toastify` is installed and the `ToastContainer` is in `root.jsx`

### Issue: "Login fails silently"
**Solution**: Check browser console for errors. Likely causes:
- Database not connected
- Test user not seeded
- API route not found

### Issue: "Email not sending"
**Solution**: In development mode, emails are sent to Ethereal. Check:
- Console logs for Ethereal test account credentials
- `.env` file doesn't override NODE_ENV to 'production'

### Issue: "API endpoint returns 404"
**Solution**: Verify routes are configured in `app/routes.js`:
- ✅ `/api/login` → `routes/api/login.jsx`
- ✅ `/api/request-password-reset` → `routes/api/request-password-reset.jsx`

---

## **Environment Variables** (Optional)

Create a `.env` file in the project root:

```env
# Email Service (gmail, sendgrid, or ethereal for dev)
EMAIL_SERVICE=ethereal

# For Gmail
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password

# For SendGrid
# SENDGRID_API_KEY=your-sendgrid-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/iu_portal

# Session Secret
SESSION_SECRET=your-secret-key

# App URL
APP_URL=http://localhost:5173
```

---

## **Project Structure**

```
app/
├── routes/
│   ├── login.jsx                    # Login form UI
│   ├── reset-password.jsx           # Password reset request form
│   ├── reset-password.$token.jsx    # Password reset form
│   └── api/
│       ├── login.jsx                # POST /api/login
│       └── request-password-reset.jsx # POST /api/request-password-reset
├── lib/
│   ├── auth.js                      # Auth utilities
│   ├── toast.js                     # Toast notification helpers
│   └── prisma.js                    # Prisma client
└── root.jsx                         # Root layout with ToastContainer
```

---

## **Notes**

- ✅ All API routes use server-side processing with Prisma
- ✅ Passwords are hashed with bcryptjs (10 rounds)
- ✅ Sessions use secure HTTP-only cookies
- ✅ Password reset tokens expire in 1 hour
- ✅ Development mode shows reset links for testing
- ✅ Production should use real email service (Gmail, SendGrid, etc.)
