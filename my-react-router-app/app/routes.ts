import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home
  index("routes/home.tsx"), // "/"
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("reset-password/:token", "routes/reset-password.$token.tsx"),

  // APP Shell layout at root
  route("", "routes/_app.tsx", [
    // Core dashboard & navigation
    route("dashboard", "routes/_app.dashboard.tsx"),
    route("curriculum", "routes/_app.curriculum.tsx"),
    route("raumbuchung", "routes/_app.raumbuchung.tsx"),
    route("room-booking", "routes/_app.room-booking.tsx"),
    route("module-handbook", "routes/_app.module-handbook.tsx"),
    route("student-id", "routes/_app.student-id.tsx"),
    route("study-organization", "routes/_app.study-organization.tsx"),
    route("info-center", "routes/_app.info-center.tsx"),
    route("benefits", "routes/_app.benefits.tsx"),
    route("security", "routes/_app.security.tsx"),
    route("exams", "routes/_app.exams.tsx"),
    route("courses", "routes/_app.courses.tsx"),
    route("courses/:courseId", "routes/_app.courses.$courseId.tsx"),
    route("courses/schedule", "routes/_app.courses.schedule.tsx"),
    route("antragsverwaltung", "routes/_app.antragsverwaltung.tsx"),

    // Certificates
    route(
      "certificates/immatriculation",
      "routes/_app.certificates.immatriculation.tsx"
    ),
    route("certificates/transcript", "routes/_app.certificates.transcript.tsx"),

    // News
    route("news", "routes/_app.news.tsx"),
    route("news/:slug", "routes/_app.news.$slug.tsx"),

    // Users (layout + nested routes)
    route("users", "routes/_app.users.tsx", [
      index("routes/_app.users._index.tsx"),
      route("new", "routes/_app.users.new.tsx"),
      route(":userId", "routes/_app.users.$userId.tsx"),
    ]),
    // Other pages
    route("events", "routes/_app.events.tsx"),
    route("faq", "routes/_app.faq.tsx"),
    route("contact", "routes/_app.contact.tsx"),
    route("tasks", "routes/_app.tasks.tsx"),
    route("files/recent", "routes/_app.files.recent.tsx"),
    route("social-media", "routes/_app.social-media.tsx"),
    route("basic-test", "routes/_app.basic-test.tsx"),
    route("form-test", "routes/_app.form-test.tsx"),
    route("console-diagnostic", "routes/_app.console-diagnostic.tsx"),
    route("notenverwaltung", "routes/_app.notenverwaltung.tsx"),
    route("praxisbericht2", "routes/_app.praxisbericht2.tsx"),

    route("toast-direct", "routes/_app.toast-direct.tsx"),
    route("toast-test", "routes/_app.toast-test.tsx"),
    route("settings", "routes/_app.settings.tsx"),
    route("redux-demo", "routes/_app.redux-demo.tsx"),
    route("library", "routes/_app.library.tsx"),
    route("vertiefungswahl", "routes/_app.vertiefungswahl.tsx"),
    route("klausuranmeldung", "routes/_app.klausuranmeldung.tsx"),
    route("lernassistent", "routes/_app.lernassistent.tsx"),
  ]),

  // API routes (handled by React Router in dev/SSR)
  route("api/health", "routes/api/health.tsx"),
  route("api/login", "routes/api/login.tsx"),
  route("api/logout", "routes/api/logout.tsx"),
  route("api/news", "routes/api/news.tsx"),
  route("api/news/:slug", "routes/api/news.$slug.tsx"),
  route("api/praxisberichte", "routes/api/praxisberichte.tsx"),
  route(
    "api/praxisberichte/:weekKey",
    "routes/api/praxisberichte.$weekKey.tsx"
  ),
  route("api/room-bookings", "routes/api.room-bookings.tsx"),
  route("api/reminders/preferences", "routes/api/reminders.preferences.tsx"),
  route("api/request-password-reset", "routes/api/request-password-reset.tsx"),
  route("api/reset-password", "routes/api/reset-password.tsx"),
  route("api/user", "routes/api/user.tsx"),
  route("api/verify-reset-token", "routes/api/verify-reset-token.tsx"),
  route("api/cron/daily-reminders", "routes/api/cron/daily-reminders.tsx"),
  route("api/forum", "routes/api/forum.tsx"),
  route("api/forum/posts", "routes/api/forum.posts.tsx"),
  route("api/contact/submit", "routes/api/contact.submit.tsx"),
  route("api/applications/submit", "routes/api/applications.submit.tsx"),
] satisfies RouteConfig;
