import pkg from "@react-router/dev/routes";
const { index, route } = pkg;

export default [
  {
    path: "/",
    file: "routes/home.jsx",
  },
  {
    path: "toast-test",
    file: "routes/toast-test.jsx",
  },
  {
    path: "toast-direct",
    file: "routes/toast-direct.jsx",
  },
  {
    path: "basic-test",
    file: "routes/basic-test.jsx",
  },
  {
    path: "form-test",
    file: "routes/form-test.jsx",
  },
  {
    path: "diagnostic",
    file: "routes/diagnostic.jsx",
  },
  {
    path: "console-diagnostic",
    file: "routes/console-diagnostic.jsx",
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
  {
    path: "room-booking",
    file: "routes/room-booking.jsx",
  },
  {
    path: "events",
    file: "routes/events.jsx",
  },
  {
    path: "files",
    file: "routes/files.jsx",
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
        path: "new",
        file: "routes/users.new.jsx",
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
    path: "api/login",
    file: "routes/api/login.jsx",
  },
  {
    path: "api/user",
    file: "routes/api/user.jsx",
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
];
