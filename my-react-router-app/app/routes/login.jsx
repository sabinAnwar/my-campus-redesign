import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../lib/toast';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    console.log('🔵 handleSubmit called');
    e.preventDefault();
    e.stopPropagation();
    
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('📝 Submitting login form:', { email, passwordLength: password?.length });

    try {
      // Send as form-encoded data
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email, password }),
        credentials: 'include', // Include cookies in request
      });

      console.log('📨 API response status:', response.status);

      const data = await response.json();
      console.log('📨 API response data:', data);

      if (data.success) {
        console.log('✅ Login successful!');
        showSuccessToast('✅ Login successful! Redirecting...');
        
        // Wait for toast to show, then redirect
        setTimeout(() => {
          console.log('🔄 Redirecting to home...');
          window.location.href = '/';
        }, 1500);
      } else if (data.error) {
        console.log('❌ Login failed:', data.error);
        setError(data.error);
        showErrorToast(data.error);
        setIsSubmitting(false);
      } else {
        console.log('❌ Unexpected response format:', data);
        setError('An unexpected error occurred');
        showErrorToast('An unexpected error occurred');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      const errorMsg = err.message || 'An error occurred during login';
      setError(errorMsg);
      showErrorToast(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-stretch">
      {/* Left side - Premium professional section - SMALLER WIDTH */}
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 relative overflow-hidden items-center justify-center p-8">
        {/* Animated background with professional effect */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-700/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Professional Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          {/* Premium Badge - Student Portal */}
          <div className="mb-8 inline-flex">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/30 backdrop-blur-md hover:bg-white/15 transition-all">
              <span className="text-sm font-bold text-white">🚀 IU Student Portal</span>
            </div>
          </div>

          {/* Main heading - Professional */}
          <h2 className="text-5xl font-black mb-4 leading-tight text-white">
            Your Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-slate-300">Command Center</span>
          </h2>

          <p className="text-lg text-slate-300 mb-12 font-semibold leading-relaxed">
            Designed by IU students for IU students. Centralize your marks, applications, and module management in one professional workspace.
          </p>

          {/* Feature cards - Professional */}
          <div className="space-y-4 mb-12">
            {/* Feature 1: Marks */}
            <div className="group cursor-pointer">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/8 border border-white/20 hover:border-cyan-400/60 transition-all duration-300 backdrop-blur-sm hover:bg-cyan-500/10">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold group-hover:text-cyan-300 transition-colors">Unified Marks</h3>
                  <p className="text-slate-400 text-sm">Track grades from both IU institutions</p>
                </div>
                <svg className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 2: Applications */}
            <div className="group cursor-pointer">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/8 border border-white/20 hover:border-indigo-400/60 transition-all duration-300 backdrop-blur-sm hover:bg-indigo-500/10">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold group-hover:text-indigo-300 transition-colors">Submit Anträge</h3>
                  <p className="text-slate-400 text-sm">Manage formal applications professionally</p>
                </div>
                <svg className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 3: Modules */}
            <div className="group cursor-pointer">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/8 border border-white/20 hover:border-purple-400/60 transition-all duration-300 backdrop-blur-sm hover:bg-purple-500/10">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors">Module Planning</h3>
                  <p className="text-slate-400 text-sm">Organize and plan your curriculum</p>
                </div>
                <svg className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stats - Professional metrics with Hamburg locations */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-700">
            <div className="text-center">
              <p className="text-3xl font-black text-cyan-300">🏢</p>
              <p className="text-sm text-slate-300 font-bold mt-2">Hammerbrook</p>
              <p className="text-xs text-slate-500">Hamburg Campus</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-blue-300">🏢</p>
              <p className="text-sm text-slate-300 font-bold mt-2">Waterloohain</p>
              <p className="text-xs text-slate-500">Hamburg Campus</p>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className="text-2xl font-black text-purple-300">500+</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Active Dual Degree Students</p>
          </div>

          {/* Footer info */}
          <p className="text-xs text-slate-400 mt-10 font-semibold border-t border-slate-700 pt-8">
            💡 Built by IU students • Managed professionally • Enterprise-grade security
          </p>
        </div>
      </div>

      {/* Right side - Premium Professional Login form - LARGER WIDTH */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 lg:p-8 bg-white min-h-screen">
        <div className="w-full max-w-2xl">
          {/* Premium Card - Much Bigger */}
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-200">
            {/* Header - Professional */}
            <div className="mb-12 text-center">
              {/* IU Logo - visible on mobile */}
              <div className="mb-8 flex justify-center lg:hidden">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl blur opacity-20"></div>
                  <div className="relative h-24 w-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-3xl">IU</span>
                  </div>
                </div>
              </div>

              {/* Title - Professional */}
              <h1 className="text-4xl font-black text-slate-900 mb-2">
                Welcome
              </h1>
              <p className="text-slate-600 text-base font-semibold mb-2">
                IU Student Portal
              </p>
              <p className="text-slate-500 text-sm font-medium">
                For currently enrolled dual degree students
              </p>
            </div>

            {/* Form */}
            <form 
              onSubmit={handleSubmit} 
              method="post"
              action="javascript:void(0)"
              className="space-y-7"
            >
              {/* Email Input - Bigger */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-bold text-slate-900 mb-3"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your.email@iu-study.org"
                    className="w-full px-5 py-4 pl-13 rounded-lg bg-slate-50 border-2 border-slate-300 text-slate-900 text-base placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition duration-300"
                  />
                  <svg className="absolute left-4 top-4.5 w-6 h-6 text-slate-600 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Password Input - Bigger */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-bold text-slate-900 mb-3"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 pl-13 rounded-lg bg-slate-50 border-2 border-slate-300 text-slate-900 text-base placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition duration-300"
                  />
                  <svg className="absolute left-4 top-4.5 w-6 h-6 text-slate-600 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="w-5 h-5 rounded bg-white border-2 border-slate-300 text-slate-900 accent-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-base text-slate-700 font-semibold cursor-pointer"
                  >
                    Keep me signed in
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="text-base font-bold text-slate-900 hover:text-slate-700 transition duration-200 underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert - Professional */}
              {error && (
                <div className="rounded-lg bg-red-50 border-2 border-red-200 p-5 backdrop-blur-sm">
                  <div className="flex gap-4">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-base font-semibold text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Sign in Button - Bigger */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-10 px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-600 font-medium text-base">Need Help?</span>
                </div>
              </div>

              {/* Support Links */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://iu.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition duration-200 text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>IU Website</span>
                </a>
                <a
                  href="mailto:support@iu-study.org"
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition duration-200 text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Support</span>
                </a>
              </div>
            </form>
          </div>

          {/* Footer - Professional */}
          <div className="mt-10 text-center space-y-3">
            <p className="text-base text-slate-700 font-semibold">
              🛡️ Built by IU Students • Professional Development
            </p>
            <p className="text-sm text-slate-500">
              Enterprise-grade security • Encrypted connections • Data protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}