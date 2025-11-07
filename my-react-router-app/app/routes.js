import pkg from "@react-router/dev/routes";
const { index, route } = pkg;

export default [
  {
    path: "/",
    file: "routes/home.jsx",
  },
  {
    path: "login",
    file: "routes/login.jsx",
  },
  {
    path: "logout",
    file: "routes/logout.jsx",
  },
  {
    path: "reset-password",
    file: "routes/reset-password.jsx",
  },
  {
    path: "reset-password/:token",
    file: "routes/reset-password.$token.jsx",
  },
  {
    path: "dashboard",
    file: "routes/dashboard.jsx",
  },

  // German alias for room booking
  {
    path: "raumbuchung",
    file: "routes/raumbuchung.jsx",
  },
  {
    path: "news",
    file: "routes/news.jsx",
    children: [
      {
        path: ":slug",
        file: "routes/news.$slug.jsx",
      },
    ],
  },
  {
    path: "courses/schedule",
    file: "routes/courses.schedule.jsx",
  },
  {
    path: "files/recent",
    file: "routes/files.recent.jsx",
  },

  {
    path: "tasks",
    file: "routes/tasks.jsx",
  },
  {
    path: "settings",
    file: "routes/settings.jsx",
  },
  {
    path: "curriculum",
    file: "routes/curriculum.jsx",
  },
  {
    path: "module-handbook",
    file: "routes/module-handbook.jsx",
  },

  {
    path: "student-id",
    file: "routes/student-id.jsx",
  },
  {
    path: "certificates/transcript",
    file: "routes/certificates.transcript.jsx",
  },
  {
    path: "certificates/immatriculation",
    file: "routes/certificates.immatriculation.jsx",
  },
  {
    path: "courses",
    file: "routes/courses.jsx",
  },
  {
    path: "contact",
    file: "routes/contact.jsx",
  },
  {
    path: "praxisbericht",
    file: "routes/praxisbericht2.jsx",
  },
  {
    path: "teacher-upload",
    file: "routes/teacher-upload.jsx",
  },
  {
    path: "users",
    file: "routes/users.jsx",
    children: [
      {
        index: true,
        file: "routes/users._index.jsx",
      },
      {
        path: ":userId",
        file: "routes/users.$userId.jsx",
      },
    ],
  },
  // API routes
  {
    path: "api/health",
    file: "routes/api/health.jsx",
  },
  {
    path: "api/praxisberichte",
    file: "routes/api/praxisberichte.jsx",
  },
  {
    path: "api/praxisberichte/:weekKey",
    file: "routes/api/praxisberichte.$weekKey.jsx",
  },
  {
    path: "api/login",
    file: "routes/api/login.jsx",
  },
  {
    path: "api/logout",
    file: "routes/api/logout.jsx",
  },
  {
    path: "api/user",
    file: "routes/api/user.jsx",
  },
  {
    path: "api/news",
    file: "routes/api/news.jsx",
  },
  {
    path: "api/news/:slug",
    file: "routes/api/news.$slug.jsx",
  },
  {
    path: "api/request-password-reset",
    file: "routes/api/request-password-reset.jsx",
  },
  {
    path: "api/verify-reset-token",
    file: "routes/api/verify-reset-token.jsx",
  },
  {
    path: "api/reset-password",
    file: "routes/api/reset-password.jsx",
  },
  {
    path: "api/reminders/preferences",
    file: "routes/api/reminders/preferences.jsx",
  },
  {
    path: "api/cron/daily-reminders",
    file: "routes/api/cron/daily-reminders.jsx",
  },
  {
    path: "faq",
    file: "routes/faq.jsx",
  },
  {
    path: "api/room-bookings",
    file: "routes/api.room-bookings.jsx",
  },
  {
    path: "room-booking",
    file: "routes/room-booking.jsx",
  },
];
