# Password Reset Email Configuration

This guide explains how to set up password reset emails for the IU Student Portal.

## Overview

The application uses Node Mailer to send password reset emails. You have three options:

1. **Development Mode** (Ethereal Email - No Setup Required)
2. **Gmail** (Gmail Account + App Password)
3. **SendGrid** (SendGrid API Key)

## Option 1: Development Mode (Ethereal Email) - Default

In development mode, the application automatically creates temporary test email accounts and displays the reset link on the screen.

**No configuration needed!** When a user clicks "Forgot Password", they will see:
- A success message on the page
- A development link to click for password reset
- A toast notification

### To use development mode:
```bash
# Just run the app - no email setup needed
npm run dev
```

## Option 2: Gmail Setup

To send emails through Gmail:

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your OS)
3. Google will generate a 16-character password
4. Copy this password

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:

```env
# Email Configuration - Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=noreply@iu-portal.com

# Application URLs
APP_URL=http://localhost:5174
API_URL=http://localhost:5174
SESSION_SECRET=your-secret-key
```

### Step 4: Restart the Application
```bash
npm run dev
```

## Option 3: SendGrid Setup

SendGrid provides reliable email delivery with free tier (100 emails/day).

### Step 1: Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your email address

### Step 2: Create API Key
1. Go to Settings > API Keys
2. Click "Create API Key"
3. Give it a name (e.g., "IU Portal")
4. Copy the API key

### Step 3: Configure Environment Variables
Create a `.env` file:

```env
# Email Configuration - SendGrid
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@iu-portal.com

# Application URLs
APP_URL=http://localhost:5174
API_URL=http://localhost:5174
SESSION_SECRET=your-secret-key
```

### Step 4: Verify Sender Email
1. Go to Sender Verification
2. Add and verify your sender email
3. Use that email in EMAIL_FROM

### Step 5: Restart the Application
```bash
npm run dev
```

## Option 4: Production Deployment (Vercel)

### For Gmail:
1. Set environment variables in Vercel dashboard:
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_PASSWORD=xxxx xxxx xxxx xxxx`
   - `EMAIL_FROM=noreply@iu-portal.com`
   - `APP_URL=https://your-vercel-domain.com`
   - `API_URL=https://your-vercel-domain.com`

### For SendGrid:
1. Set environment variables in Vercel dashboard:
   - `EMAIL_SERVICE=sendgrid`
   - `SENDGRID_API_KEY=SG.xxxxx...`
   - `EMAIL_FROM=noreply@iu-portal.com`
   - `APP_URL=https://your-vercel-domain.com`
   - `API_URL=https://your-vercel-domain.com`

## Testing Password Reset

### Local Testing (Development Mode):
1. Navigate to Login page → "Forgot your password?"
2. Enter an email address (any email works in dev mode)
3. You should see a toast notification "Password reset email sent!"
4. A development link will be displayed
5. Click the link to reset password

### Testing with Real Email:
1. Configure Gmail or SendGrid (see above)
2. Navigate to Login page → "Forgot your password?"
3. Enter your real email address
4. You should receive an email with reset link
5. Click the link in the email to reset password

## Email Templates

The application sends beautifully formatted HTML emails with:
- IU Portal branding
- Clear password reset instructions
- One-click button to reset password
- Plain text fallback for email clients that don't support HTML
- 1-hour expiration on reset tokens

## Troubleshooting

### "Failed to send reset email" Error
1. Check that `.env` file exists and has correct values
2. For Gmail: Verify 2FA is enabled and you're using the App Password (16 characters)
3. For SendGrid: Verify API key is correct and sender email is verified

### Reset Link Expired
- Reset links are valid for 1 hour
- User needs to request a new reset email if expired

### Email Not Received
- Check spam/junk folder
- For development mode: Check browser console for reset link
- For Gmail: Check "Allow less secure apps" setting
- For SendGrid: Check API key and sender verification

## Files Modified

- `api/index.js` - Email sending endpoint
- `app/lib/toast.js` - Toast notification utilities
- `app/routes/reset-password.jsx` - Reset password request form
- `app/routes/reset-password.$token.jsx` - Reset password form
- `app/lib/auth.js` - Password reset token creation and email sending
- `app/root.jsx` - Toast container setup
- `.env` - Environment variables (create this file)

## Next Steps

1. Choose an email service (or use development mode for now)
2. Configure environment variables in `.env`
3. Restart the application
4. Test the password reset flow
5. Deploy to production with your chosen email service
