import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useRouteError,
  Form,
  Scripts,
} from "react-router";
import { useState, useEffect } from "react";

export const links = () => [{ rel: "icon", href: "/favicon.ico" }];

// HTML Document wrapper
export function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>IU Student Portal</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class'
              }
            `,
          }}
        />
      </head>
      <body>
        <div id="root">
          <Outlet />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
        />
        <Scripts />
      </body>
    </html>
  );
}

// Main app layout component
export default function Root() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          console.log("Auth check:", data);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">IU</span>
              </div>
              <span className="font-bold text-gray-900 hidden sm:inline">
                IU Portal
              </span>
            </Link>

            <div className="hidden md:flex space-x-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                Home
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 rounded-md"
                  >
                    Sign out
                  </button>
                </Form>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">IU Student Portal © 2025</p>
        </div>
      </footer>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Error
        </h2>
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            {isRouteErrorResponse(error) ? (
              <p>
                {error.status} {error.statusText}
              </p>
            ) : error instanceof Error ? (
              <p>{error.message}</p>
            ) : (
              <p>Unknown error</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
