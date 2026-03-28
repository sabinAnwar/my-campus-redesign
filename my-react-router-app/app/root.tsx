import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import type { Route } from "./+types/root";
import appStyles from "./styles/index.css?url";
import toastifyStyles from "react-toastify/dist/ReactToastify.css?url";
import { ThemeProvider } from "./store/ThemeContext";
import { LanguageProvider } from "./store/LanguageContext";

// ---------------------------------------------
// DOCUMENT LAYOUT
// ---------------------------------------------
export const links: Route.LinksFunction = () => [
  // Favicon
  { rel: "icon", href: "/favicon-iu.svg?v=2", type: "image/svg+xml" },
  { rel: "shortcut icon", href: "/favicon-iu.svg?v=2", type: "image/svg+xml" },
  // Preconnect to font servers early
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  // Preload critical font with swap display
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Source+Sans+Pro:wght@300;400;600;700&display=swap",
    as: "style",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Source+Sans+Pro:wght@300;400;600;700&display=swap",
  },
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: toastifyStyles },
];

// THE HTML SHELL (DOCUMENT)
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="IU Student Plattform - Manage your courses, grades, and academic journey"
        />
        <meta name="theme-color" content="#0f172a" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <Meta />
        <Links />
      </head>

      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ---------------------------------------------
// APP ROOT (HIER MUSS DER PROVIDER SEIN!)
// ---------------------------------------------
export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="iu-theme">
      <LanguageProvider storageKey="iu-language">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Outlet />
      </LanguageProvider>
    </ThemeProvider>
  );
}

// ---------------------------------------------
// ERROR BOUNDARY
// ---------------------------------------------
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (
    process.env.NODE_ENV !== "production" &&
    error &&
    error instanceof Error
  ) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
