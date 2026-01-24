//// TYPES
//
interface SubmitButtonProps {
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Text shown while submitting */
  loadingText: string;
  /** Default button text */
  children: string;
}

//// STYLES
//
const STYLES = {
  button: `w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium 
           text-white hover:bg-blue-700 focus:outline-none focus:ring-2 
           focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400`,
} as const;

//// COMPONENT
//
/**
 * Form submit button with loading state
 */
export function SubmitButton({ isSubmitting, loadingText, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={STYLES.button}
    >
      {isSubmitting ? loadingText : children}
    </button>
  );
}
