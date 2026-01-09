import { useParams, Link } from "react-router-dom";
import {
  AuthCard,
  FormInput,
  AlertMessage,
  SubmitButton,
  LoadingSpinner,
} from "../components/auth";
import { useResetPassword } from "../hooks/usePasswordReset";

//// CONSTANTS
//
const PAGE_TITLE = "Set new password";
const PAGE_SUBTITLE = "Please enter your new password";
const INVALID_TOKEN_TITLE = "Invalid Token";
const INVALID_TOKEN_MESSAGE =
  "This password reset link is invalid or has expired.";

//// LOADER
//
export const loader = async () => null;

//// SUB-COMPONENTS
//
/**
 * Invalid token error view
 */
function InvalidTokenView() {
  return (
    <AuthCard title={INVALID_TOKEN_TITLE}>
      <div className="text-center">
        <p className="text-gray-700 mb-6">{INVALID_TOKEN_MESSAGE}</p>
        <Link
          to="/reset-password"
          className="text-sm font-black uppercase tracking-widest text-iu-blue dark:text-white hover:text-iu-blue/80 dark:hover:text-white transition-colors"
        >
          Request a new password reset
        </Link>
      </div>
    </AuthCard>
  );
}

//// MAIN COMPONENT
//
/**
 * Password reset form page
 * Step 2: User enters new password after clicking email link
 */
export default function ResetPassword() {
  const { token } = useParams();
  const { error, isSubmitting, isValidating, isValidToken, handleSubmit } =
    useResetPassword(token);

  // Show loading spinner while validating token
  if (isValidating) {
    return <LoadingSpinner />;
  }

  // Show error view for invalid tokens
  if (!isValidToken) {
    return <InvalidTokenView />;
  }

  return (
    <AuthCard title={PAGE_TITLE} subtitle={PAGE_SUBTITLE}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput id="password" label="New password" type="password" />
        <FormInput
          id="confirmPassword"
          label="Confirm new password"
          type="password"
        />

        {error && <AlertMessage variant="error">{error}</AlertMessage>}

        <SubmitButton
          isSubmitting={isSubmitting}
          loadingText="Setting password..."
        >
          Set new password
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
