import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useRouteError,
} from "react-router";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect", 
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // Add Tailwind CSS via CDN
  {
    rel: "stylesheet",
    href: "https://cdn.tailwindcss.com",
  },
];

export function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script>{`
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                }
              }
            }
          }
        `}</script>
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Enhanced Navigation Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <h1 className="text-white text-2xl font-bold drop-shadow-lg">UserManager</h1>
            </div>
            
            {/* Main Navigation */}
            <ul className="flex items-center space-x-8 list-none">
              <li>
                <Link 
                  to="/" 
                  className="group flex items-center space-x-2 text-white font-semibold hover:text-yellow-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/20 drop-shadow-md"
                >
                  <span className="text-xl">🏠</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/users" 
                  className="group flex items-center space-x-2 text-white font-semibold hover:text-yellow-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/20 drop-shadow-md"
                >
                  <span className="text-xl">👥</span>
                  <span>All Users</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/users/new" 
                  className="group flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/20"
                >
                  <span className="text-xl">➕</span>
                  <span>Add User</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="mt-auto bg-black/40 backdrop-blur-lg border-t border-white/30 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white font-medium drop-shadow-md">Built with React Router v7 & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h1>Something went wrong</h1>
      <p>
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : "Unknown Error"}
      </p>
    </div>
  );
}
