import type { ReactNode } from "react";

// TYPES

interface AuthCardProps {
  /** Card title */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Card content */
  children: ReactNode;
}

// STYLES

const STYLES = {
  container: "flex min-h-screen items-center justify-center bg-gray-50",
  wrapper: "w-full max-w-md",
  card: "rounded-lg bg-white px-8 py-10 shadow-md",
  header: "mb-8 text-center",
  title: "text-3xl font-bold text-gray-900",
  subtitle: "mt-2 text-sm text-gray-700",
} as const;

// COMPONENT

/**
 * Reusable authentication card layout
 * Used for login, reset password, and similar auth pages
 */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className={STYLES.container}>
      <div className={STYLES.wrapper}>
        <div className={STYLES.card}>
          <div className={STYLES.header}>
            <h2 className={STYLES.title}>{title}</h2>
            {subtitle && <p className={STYLES.subtitle}>{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
