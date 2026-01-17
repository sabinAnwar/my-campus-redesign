import { useState, useEffect, useCallback } from "react";
import { useFetcher } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { showErrorToast, showSuccessToast } from "../lib/toast";
import { MOTIVATIONAL_QUOTES } from "../data/quotes";

//
// CONSTANTS
//

const QUOTE_ROTATION_INTERVAL = 8000;
const QUOTE_FADE_DURATION = 500;

//
// TYPES
//

interface QuoteState {
  currentIndex: number;
  isFading: boolean;
}

interface LoginState {
  error: string | null;
  isSubmitting: boolean;
}

//
// USE LOGIN HOOK
//

/**
 * Hook for handling login form submission and state
 */
export function useLogin() {
  const fetcher = useFetcher();
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = fetcher.state === "submitting";

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as { success?: boolean; error?: string };
      if (data.success) {
        showSuccessToast("Login successful!");
        window.location.replace("/dashboard");
      } else if (data.error) {
        setError(data.error);
        showErrorToast(data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      fetcher.submit(new FormData(e.currentTarget), {
        method: "POST",
        action: "/api/login",
      });
    },
    [fetcher]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    error,
    isSubmitting,
    handleSubmit,
    clearError,
  };
}

//
// USE QUOTE ROTATION HOOK
//

/**
 * Hook for rotating motivational quotes with fade animation
 */
export function useQuoteRotation() {
  const [state, setState] = useState<QuoteState>({
    currentIndex: Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length),
    isFading: false,
  });

  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({ ...prev, isFading: true }));
      setTimeout(() => {
        setState((prev) => ({
          currentIndex: (prev.currentIndex + 1) % MOTIVATIONAL_QUOTES.length,
          isFading: false,
        }));
      }, QUOTE_FADE_DURATION);
    }, QUOTE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = useCallback((idx: number) => {
    setState((prev) => ({ ...prev, isFading: true }));
    setTimeout(() => {
      setState({ currentIndex: idx, isFading: false });
    }, 300);
  }, []);

  return {
    currentQuote: MOTIVATIONAL_QUOTES[state.currentIndex],
    currentIndex: state.currentIndex,
    isFading: state.isFading,
    handleDotClick,
    totalQuotes: MOTIVATIONAL_QUOTES.length,
  };
}

//
// USE LOGOUT HOOK
//

const LOGOUT_REDIRECT_DELAY = 2000;
/**
 * Hook for handling logout logic
 * Redirects to Auth0 logout after the animation
 */
export function useLogout() {
  const { logout } = useAuth0();

  useEffect(() => {
    // Redirect after animation completes
    const timer = setTimeout(() => {
      logout({ logoutParams: { returnTo: window.location.origin } });
    }, LOGOUT_REDIRECT_DELAY);

    return () => clearTimeout(timer);
  }, [logout]);
}
