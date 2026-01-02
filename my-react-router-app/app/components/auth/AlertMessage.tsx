import type { ReactNode } from "react";

// ============================================================================
// TYPES
// ============================================================================

type AlertVariant = "error" | "success";

interface AlertMessageProps {
  /** Alert type - determines styling */
  variant: AlertVariant;
  /** Alert message content */
  children: ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const VARIANT_STYLES: Record<AlertVariant, { container: string; text: string }> = {
  error: {
    container: "rounded-md bg-red-50 p-4",
    text: "text-sm font-medium text-red-800",
  },
  success: {
    container: "rounded-md bg-green-50 p-4",
    text: "text-sm font-medium text-green-800",
  },
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Reusable alert message component
 * Supports error and success variants
 */
export function AlertMessage({ variant, children }: AlertMessageProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={styles.container}>
      <div className="flex">
        <div className="ml-3">
          <div className={styles.text}>{children}</div>
        </div>
      </div>
    </div>
  );
}
