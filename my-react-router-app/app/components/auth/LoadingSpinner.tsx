// ============================================================================
// STYLES
// ============================================================================

const STYLES = {
  container: "flex items-center justify-center min-h-screen",
  spinner: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600",
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Full-page loading spinner
 * Used during async validation
 */
export function LoadingSpinner() {
  return (
    <div className={STYLES.container}>
      <div className={STYLES.spinner} />
    </div>
  );
}
