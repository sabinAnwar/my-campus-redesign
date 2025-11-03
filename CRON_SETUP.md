# Scheduling daily reminders on Vercel Hobby

Vercel Hobby accounts only support cron jobs that run once per day. If you need per-minute precision for user-specific reminder times (HH:MM), you have two options:

## Option A: Upgrade to Pro (native every-minute cron)
- Change the cron expression for `/api/cron/daily-reminders` to `* * * * *` in `vercel.json` after upgrading.
- No further changes needed.

## Option B: Use an external scheduler to ping your API every minute (recommended for Hobby)
Keep Vercel's daily cron (as a health check/fallback), and configure an external service to call your API every minute. For example, using cron-job.org (free):

1. Create a new cron job in https://cron-job.org
2. URL:
   - Production: `https://<your-vercel-domain>/api/cron/daily-reminders?secret=<CRON_SECRET>`
   - Local (optional): `http://localhost:5173/api/cron/daily-reminders?secret=<CRON_SECRET>`
3. Schedule: Every minute.
4. HTTP Method: GET
5. Headers: none required

Security:
- Set `CRON_SECRET` in Vercel Project Settings → Environment Variables.
- The endpoint allows Vercel's native header (`x-vercel-cron: 1`) OR a matching `?secret=`. External schedulers must use the `?secret=` parameter.

## Notes
- Users can pick any HH:MM; the cron endpoint checks each user’s timezone and sends only when the current time matches.
- We continue to run a once-per-day Vercel cron (`0 18 * * *`) as a fallback; it will only deliver to users whose chosen time matches at that hour/minute.
- If you switch to SendGrid’s Web API in the future, you can schedule per-user messages via `send_at` without minute polling.

## Troubleshooting
- If you see `Unknown field reminderMinute` errors, run:
  - `npx prisma migrate dev`
  - `npx prisma generate`
- Ensure `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD` (or SendGrid creds) and `APP_URL` are set.
