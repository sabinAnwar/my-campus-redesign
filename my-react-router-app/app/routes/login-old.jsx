import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../lib/toast";

const TRANSLATIONS = {
  de: {
    dualstudentenportal: "Duales Studieren Portal",
    iuBranding: "Deine zentrale Lernplattform für erfolgreiches duales Studium",
    login: "Anmelden",
    email: "E-Mail-Adresse",
    password: "Passwort",
    rememberMe: "Passwort merken",
    forgotPassword: "Passwort vergessen?",
    signIn: "Jetzt anmelden",
    noAccount: "Noch kein Konto?",
    signup: "Jetzt registrieren",
    invalidCredentials: "E-Mail oder Passwort ungültig",
    language: "Sprache",
    features: "Unsere Features",
    coursesFeature: "📚 Kursverwaltung",
    coursesDesc: "Verwalte deine Kurse mit Videos, Skripten und Aufgaben",
    messagesFeature: "💬 Nachrichten",
    messagesDesc: "Kommuniziere mit Dozenten und Mitstudierenden",
    tasksFeature: "📋 Aufgabenverwaltung",
    tasksDesc: "Tracke deine Aufgaben und Fristen",
    turnitinFeature: "🎯 Turnitin Integration",
    turnitinDesc: "Automatische Plagiatsprüfung für Abgaben",
    testUsers: "Test Benutzer",
    email1: "sabin.elanwar@iu-study.org",
    email2: "student@iu.edu",
    email3: "sabinanwar6@gmail.com",
    password1: "password123",
    password2: "Test@1234",
    testPassword: "password123",
  },
  en: {
    dualstudentenportal: "Dual Degree Student Portal",
    iuBranding:
      "Your central learning platform for successful dual degree studies",
    login: "Login",
    email: "Email Address",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signIn: "Sign In Now",
    noAccount: "Don't have an account?",
    signup: "Register Now",
    invalidCredentials: "Invalid email or password",
    language: "Language",
    features: "Our Features",
    coursesFeature: "📚 Course Management",
    coursesDesc: "Manage your courses with videos, scripts and assignments",
    messagesFeature: "💬 Messages",
    messagesDesc: "Communicate with instructors and fellow students",
    tasksFeature: "📋 Task Management",
    tasksDesc: "Track your tasks and deadlines",
    turnitinFeature: "🎯 Turnitin Integration",
    turnitinDesc: "Automatic plagiarism detection for submissions",
    testUsers: "Test Users",
    email1: "sabin.elanwar@iu-study.org",
    email2: "student@iu.edu",
    email3: "sabinanwar6@gmail.com",
    password1: "password123",
    password2: "Test@1234",
    testPassword: "password123",
  },
};

export default function LoginPage() {
  const [language, setLanguage] = useState("de");
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebugInfo("");

    try {
      console.log("🔵 Attempting login with:", {
        email,
        passwordLength: password.length,
      });

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({ email, password }),
      });

      console.log("📨 API response status:", response.status);

      const data = await response.json();
      console.log("📨 API response data:", data);

      setDebugInfo(JSON.stringify(data, null, 2));

      if (data.success) {
        showSuccessToast("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const errorMsg = data.error || t.invalidCredentials;
        setError(errorMsg);
        showErrorToast(errorMsg);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      const errorMsg = err.message || t.invalidCredentials;
      setError(errorMsg);
      setDebugInfo(`Error: ${err.message}`);
      showErrorToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillTestUser = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  const bgClass = darkMode
    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    : "bg-gradient-to-br from-white via-blue-50 to-slate-50";

  const cardClass = darkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-blue-100";

  const textClass = darkMode ? "text-white" : "text-slate-900";
  const mutedClass = darkMode ? "text-slate-400" : "text-slate-600";
  const inputBgClass = darkMode
    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400";

  return (
    <div
      className={`min-h-screen ${bgClass} transition-colors duration-300 flex flex-col`}
    >
      {/* Header */}
      <header
        className={`${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-blue-100"} backdrop-blur-md border-b sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">IU</span>
              </div>
              <div>
                <h1 className={`text-lg font-black ${textClass}`}>IU Campus</h1>
                <p
                  className={`text-xs font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Dual Degree Portal
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg border transition cursor-pointer ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    : "bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200"
                }`}
              >
                <option value="de">🇩🇪 Deutsch</option>
                <option value="en">🇬🇧 English</option>
              </select>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 rounded-lg font-semibold transition border ${
                  darkMode
                    ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                    : "bg-slate-900/10 border-slate-900/20 text-slate-900 hover:bg-slate-900/20"
                }`}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Branding & Features */}
          <div className="space-y-8 hidden lg:block">
            <div>
              <h2
                className={`text-4xl lg:text-5xl font-black mb-4 ${textClass}`}
              >
                {t.dualstudentenportal}
              </h2>
              <p className={`text-lg ${mutedClass}`}>{t.iuBranding}</p>
            </div>

            {/* Features Grid */}
            <div className="space-y-4">
              {[
                { title: t.coursesFeature, desc: t.coursesDesc },
                { title: t.messagesFeature, desc: t.messagesDesc },
                { title: t.tasksFeature, desc: t.tasksDesc },
                { title: t.turnitinFeature, desc: t.turnitinDesc },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 p-4 rounded-lg border transition ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                      : "bg-blue-50/50 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <div className="flex-1">
                    <p className={`font-semibold ${textClass}`}>
                      {feature.title}
                    </p>
                    <p className={`text-sm ${mutedClass}`}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Users Info */}
            <div
              className={`rounded-lg border p-4 ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-yellow-50/50 border-yellow-200"}`}
            >
              <p className={`font-bold mb-3 ${textClass}`}>🧪 {t.testUsers}:</p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className={`font-semibold ${textClass}`}>1. {t.email1}</p>
                  <p className={mutedClass}>{t.password1}: password123</p>
                </div>
                <div>
                  <p className={`font-semibold ${textClass}`}>2. {t.email2}</p>
                  <p className={mutedClass}>{t.password1}: password123</p>
                </div>
                <div>
                  <p className={`font-semibold ${textClass}`}>3. {t.email3}</p>
                  <p className={mutedClass}>{t.password1}: Test@1234</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className={`rounded-2xl shadow-2xl border p-8 ${cardClass}`}>
            <h3 className={`text-2xl font-black mb-6 ${textClass}`}>
              👋 {t.login}
            </h3>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${textClass}`}
                >
                  ✉️ {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@iu-student.de"
                  className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${textClass}`}
                >
                  🔐 {t.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className={`text-sm font-semibold cursor-pointer ${mutedClass}`}
                  >
                    {t.rememberMe}
                  </label>
                </div>
                <a
                  href="/reset-password"
                  className={`text-sm font-semibold ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                >
                  {t.forgotPassword}
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className={`rounded-lg p-4 border ${darkMode ? "bg-red-900/30 border-red-700 text-red-400" : "bg-red-100 border-red-300 text-red-700"}`}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* Debug Info */}
              {debugInfo && (
                <div
                  className={`rounded-lg p-3 text-xs font-mono overflow-auto max-h-32 border ${darkMode ? "bg-slate-700/50 border-slate-600 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-700"}`}
                >
                  <pre>{debugInfo}</pre>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-300 transform hover:scale-105 active:scale-95 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                {loading ? "⏳ " + t.login + "..." : "🚀 " + t.signIn}
              </button>

              {/* Test User Quick Buttons */}
              <div
                className={`space-y-2 p-3 rounded-lg border ${darkMode ? "bg-slate-700/30 border-slate-600" : "bg-blue-50/30 border-blue-200"}`}
              >
                <p className={`text-xs font-semibold ${mutedClass} mb-2`}>
                  🧪 Quick Test:
                </p>
                <button
                  type="button"
                  onClick={() =>
                    fillTestUser("sabin.elanwar@iu-study.org", "password123")
                  }
                  className={`w-full px-3 py-2 text-xs font-semibold rounded transition ${
                    darkMode
                      ? "bg-slate-600 text-white hover:bg-slate-500"
                      : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                  }`}
                >
                  Test User 1
                </button>
                <button
                  type="button"
                  onClick={() => fillTestUser("student@iu.edu", "password123")}
                  className={`w-full px-3 py-2 text-xs font-semibold rounded transition ${
                    darkMode
                      ? "bg-slate-600 text-white hover:bg-slate-500"
                      : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                  }`}
                >
                  Test User 2
                </button>
                <button
                  type="button"
                  onClick={() =>
                    fillTestUser("sabinanwar6@gmail.com", "Test@1234")
                  }
                  className={`w-full px-3 py-2 text-xs font-semibold rounded transition ${
                    darkMode
                      ? "bg-slate-600 text-white hover:bg-slate-500"
                      : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                  }`}
                >
                  Test User 3
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
