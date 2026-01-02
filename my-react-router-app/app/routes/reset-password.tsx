import { Link } from "react-router-dom";
import {
  AuthCard,
  FormInput,
  AlertMessage,
  SubmitButton,
} from "../components/auth";
import { useRequestReset } from "../hooks/usePasswordReset";

// ============================================================================
// CONSTANTS
// ============================================================================

const PAGE_TITLE = "Reset your password";
const PAGE_SUBTITLE =
  "Enter your email address and we'll send you a link to reset your password";
const SUCCESS_MESSAGE =
  "If an account exists with this email, you will receive a password reset link shortly.";

// ============================================================================
// LOADER
// ============================================================================

export const loader = async () => null;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Password reset request page
 * Step 1: User enters email to receive reset link
 */
export default function RequestReset() {
  const { error, success, resetLink, isSubmitting, handleSubmit } =
    useRequestReset();

  return (
    <AuthCard title={PAGE_TITLE} subtitle={PAGE_SUBTITLE}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
        />

        {error && <AlertMessage variant="error">{error}</AlertMessage>}

        {success && (
          <AlertMessage variant="success">
            {SUCCESS_MESSAGE}
            {/* Development only - remove in production */}
            {resetLink && (
              <div className="mt-2">
                <p className="text-sm text-green-700 mb-2">Development link:</p>
                <Link
                  to={resetLink}
                  className="inline-block text-sm font-medium text-green-700 bg-green-100 px-3 py-2 rounded hover:bg-green-200 transition-colors"
                >
                  Click here to reset password
                </Link>
              </div>
            )}
          </AlertMessage>
        )}

        <SubmitButton isSubmitting={isSubmitting} loadingText="Sending...">
          Send reset link
        </SubmitButton>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
