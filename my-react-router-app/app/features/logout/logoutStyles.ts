/**
 * Logout animation styles
 * Extracted from inline <style> tag for better maintainability
 */

export const LOGOUT_ANIMATION_STYLES = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0) rotate(-180deg);
    }
    50% { transform: scale(1.1) rotate(0deg); }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes progressBar {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }

  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.05);
    }
  }

  .animate-fadeInScale { animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
  .animate-bounceIn { animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
  .animate-progressBar { animation: progressBar 2s ease-in-out infinite; }
  .animate-blob { animation: blob 7s infinite; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 3s linear infinite; }
  .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }

  .animation-delay-200 { animation-delay: 200ms; }
  .animation-delay-400 { animation-delay: 400ms; }
  .animation-delay-600 { animation-delay: 600ms; }
  .animation-delay-800 { animation-delay: 800ms; }
  .animation-delay-1000 { animation-delay: 1000ms; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
`;
