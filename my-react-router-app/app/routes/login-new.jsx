import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("de");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  const translations = {
    de: {
      title: "IU Studierendenportal",
      subtitle: "Dual-Degree Studium",
      email: "E-Mail",
      password: "Passwort",
      login: "Anmelden",
      forgotPassword: "Passwort vergessen?",
      rememberMe: "Angemeldet bleiben",
      loading: "Wird angemeldet...",
      error: "Fehler bei der Anmeldung",
      invalidCredentials: "Ungültige E-Mail oder Passwort",
      testUsers: "Test-Nutzer (zum Debuggen)",
      debug: "Debug-Info",
      darkMode: "Dunkler Modus",
    },
    en: {
      title: "IU Student Portal",
      subtitle: "Dual Degree Studies",
      email: "Email",
      password: "Password",
      login: "Sign In",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember me",
      loading: "Signing in...",
      error: "Login failed",
      invalidCredentials: "Invalid email or password",
      testUsers: "Test Users (for debugging)",
      debug: "Debug Info",
      darkMode: "Dark Mode",
    },
  };

  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDebugInfo("");
    setLoading(true);

    try {
      console.log("📝 Attempting login with:", { email, password });
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      console.log("🔄 Response status:", response.status);

      const data = await response.json();
      console.log("📊 Response data:", data);
      setDebugInfo(JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        console.log("✅ Login successful!");
        setEmail("");
        setPassword("");
        // Wait a moment for cookie to be set
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        console.error("❌ Login failed:", data.error);
        setError(data.error || t.invalidCredentials);
      }
    } catch (err) {
      console.error("❌ Network/Parse error:", err);
      setError(err.message || t.error);
      setDebugInfo(JSON.stringify({ error: err.message, stack: err.stack }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const fillTestUser = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setDebugInfo(`✓ Test user filled: ${testEmail}\nPassword: ${testPassword}\nNow click the login button.`);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 to-white"
      }`}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "bg-slate-700 text-yellow-400" : "bg-gray-200 text-blue-600"
          }`}
          title={t.darkMode}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "de" ? "en" : "de")}
          className={`px-3 py-2 rounded-lg transition-colors font-medium ${
            darkMode
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {language === "de" ? "EN" : "DE"}
        </button>
      </div>

      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold mb-2 transition-colors ${
              darkMode ? "text-white" : "text-blue-900"
            }`}
          >
            {t.title}
          </h1>
          <p
            className={`text-sm transition-colors ${
              darkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            {t.subtitle}
          </p>
        </div>

        {/* Login Form Card */}
        <div
          className={`rounded-lg shadow-xl p-8 transition-colors ${
            darkMode ? "bg-slate-800" : "bg-white"
          }`}
        >
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 transition-colors ${
                  darkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none focus:border-blue-500 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="student@iu.edu"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 transition-colors ${
                  darkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none focus:border-blue-500 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className={`flex items-center gap-2 cursor-pointer ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                <input type="checkbox" className="rounded" />
                {t.rememberMe}
              </label>
              <a
                href="/reset-password"
                className="text-blue-600 hover:underline transition-colors"
              >
                {t.forgotPassword}
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                loading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {loading ? `⏳ ${t.loading}` : `🔒 ${t.login}`}
            </button>
          </form>

          {/* Test Users Section */}
          <div className="mt-6 pt-6 border-t transition-colors" style={darkMode ? {borderColor: "#334155"} : {borderColor: "#e5e7eb"}}>
            <p className={`text-xs font-semibold mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
              {t.testUsers}
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillTestUser("sabin.elanwar@iu-study.org", "password123")}
                className={`p-2 rounded text-xs font-mono transition-colors ${
                  darkMode
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                sabin.elanwar@iu-study.org
              </button>
              <button
                type="button"
                onClick={() => fillTestUser("student@iu.edu", "password123")}
                className={`p-2 rounded text-xs font-mono transition-colors ${
                  darkMode
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                student@iu.edu
              </button>
              <button
                type="button"
                onClick={() => fillTestUser("sabinanwar6@gmail.com", "Test@1234")}
                className={`p-2 rounded text-xs font-mono transition-colors ${
                  darkMode
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                sabinanwar6@gmail.com
              </button>
            </div>
          </div>

          {/* Debug Info */}
          {debugInfo && (
            <div className="mt-4 pt-4 border-t transition-colors" style={darkMode ? {borderColor: "#334155"} : {borderColor: "#e5e7eb"}}>
              <p className={`text-xs font-semibold mb-2 transition-colors ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                {t.debug}
              </p>
              <pre
                className={`text-xs p-2 rounded overflow-auto max-h-40 transition-colors ${
                  darkMode
                    ? "bg-slate-700 text-slate-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
