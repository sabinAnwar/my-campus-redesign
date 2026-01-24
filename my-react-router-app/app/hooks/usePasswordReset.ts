import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "~/utils/toast";

//
// CONSTANTS
//

const API_ENDPOINTS = {
  REQUEST_RESET: "/api/request-password-reset",
  VERIFY_TOKEN: "/api/verify-reset-token",
  RESET_PASSWORD: "/api/reset-password",
} as const;

const MESSAGES = {
  SUCCESS_EMAIL_SENT: " Password reset email sent! Check your inbox.",
  SUCCESS_RESET: " Password reset successfully! Redirecting to login...",
  ERROR_ENTER_PASSWORD: "Please enter a new password",
  ERROR_PASSWORD_LENGTH: "Password must be at least 8 characters long",
  ERROR_PASSWORD_MISMATCH: "Passwords do not match",
  ERROR_INVALID_TOKEN: "Invalid or expired reset token",
  ERROR_VALIDATION: "An error occurred while validating the token",
  ERROR_RESET_FAILED: "Failed to reset password",
  ERROR_GENERIC: "An error occurred",
} as const;

const MIN_PASSWORD_LENGTH = 8;
const REDIRECT_DELAY_MS = 2000;

//
// HELPER FUNCTIONS
//

/**
 * Extract error message from unknown error type
 */
function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}

//
// REQUEST RESET HOOK
//

interface RequestResetState {
  error: string | null;
  success: boolean;
  resetLink: string | null;
  isSubmitting: boolean;
}

interface UseRequestResetReturn extends RequestResetState {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Hook for requesting password reset email
 */
export function useRequestReset(): UseRequestResetReturn {
  const [state, setState] = useState<RequestResetState>({
    error: null,
    success: false,
    resetLink: null,
    isSubmitting: false,
  });

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: null, success: false, isSubmitting: true }));

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    try {
      const response = await fetch(API_ENDPOINTS.REQUEST_RESET, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: typeof email === "string" ? email : "",
        }),
      });

      const contentType = response.headers.get("content-type");

      // Validate JSON response
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}`);
      }

      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          success: true,
          resetLink: data.resetLink || null,
          isSubmitting: false,
        }));
        showSuccessToast(MESSAGES.SUCCESS_EMAIL_SENT);
      } else if (data.error) {
        setState(prev => ({ ...prev, error: data.error, isSubmitting: false }));
        showErrorToast(data.error);
      }
    } catch (err) {
      const errMsg = getErrorMessage(err, MESSAGES.ERROR_GENERIC);
      setState(prev => ({ ...prev, error: errMsg, isSubmitting: false }));
      showErrorToast(errMsg);
    }
  }, []);

  return { ...state, handleSubmit };
}

//
// RESET PASSWORD HOOK
//

interface ResetPasswordState {
  error: string | null;
  isSubmitting: boolean;
  isValidating: boolean;
  isValidToken: boolean;
}

interface UseResetPasswordReturn extends ResetPasswordState {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Hook for validating token and resetting password
 */
export function useResetPassword(token: string | undefined): UseResetPasswordReturn {
  const navigate = useNavigate();
  const [state, setState] = useState<ResetPasswordState>({
    error: null,
    isSubmitting: false,
    isValidating: true,
    isValidToken: false,
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        setState(prev => ({
          ...prev,
          isValidToken: response.ok && data.valid,
          error: response.ok && data.valid ? null : MESSAGES.ERROR_INVALID_TOKEN,
          isValidating: false,
        }));
      } catch {
        setState(prev => ({
          ...prev,
          error: MESSAGES.ERROR_VALIDATION,
          isValidToken: false,
          isValidating: false,
        }));
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: null, isSubmitting: true }));

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validate password
    if (!password || typeof password !== "string") {
      setState(prev => ({ ...prev, error: MESSAGES.ERROR_ENTER_PASSWORD, isSubmitting: false }));
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setState(prev => ({ ...prev, error: MESSAGES.ERROR_PASSWORD_LENGTH, isSubmitting: false }));
      return;
    }

    if (password !== confirmPassword) {
      setState(prev => ({ ...prev, error: MESSAGES.ERROR_PASSWORD_MISMATCH, isSubmitting: false }));
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errMsg = data.error || MESSAGES.ERROR_RESET_FAILED;
        setState(prev => ({ ...prev, error: errMsg, isSubmitting: false }));
        showErrorToast(errMsg);
        return;
      }

      showSuccessToast(MESSAGES.SUCCESS_RESET);
      setTimeout(() => navigate("/login"), REDIRECT_DELAY_MS);
    } catch (err) {
      const errMsg = getErrorMessage(err, MESSAGES.ERROR_GENERIC);
      setState(prev => ({ ...prev, error: errMsg, isSubmitting: false }));
      showErrorToast(errMsg);
    }
  }, [token, navigate]);

  return { ...state, handleSubmit };
}
