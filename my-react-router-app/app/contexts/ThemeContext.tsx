import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

type ThemeTokens = {
  background: { page: string; shellGradient: string };
  text: { primary: string; secondary: string };
};

type ThemeContextType = {
  theme: "light" | "dark";
  isDark: boolean;
  tokens: ThemeTokens;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "iu-theme",
}: {
  children: ReactNode;
  defaultTheme?: "light" | "dark";
  storageKey?: string;
}) {
  // SSR-safe initial state (light by default)
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  // Load persisted theme on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey) as
      | "light"
      | "dark"
      | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, [storageKey]);

  const isDark = theme === "dark";

  // Update html class + persist
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    window.localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // design tokens
  const tokens: ThemeTokens = {
    background: {
      page: isDark ? "#0f172a" : "#eef2ff",
      shellGradient: isDark
        ? "linear-gradient(to bottom, #0f172a, #1e293b)"
        : "linear-gradient(to bottom, #e0e7ff, #f8fafc)",
    },
    text: {
      primary: isDark ? "#f8fafc" : "#0f172a",
      secondary: isDark ? "#94a3b8" : "#475569",
    },
  };

  // Only allow "light" or "dark" to be set, ignore "system"
  const handleSetTheme = (newTheme: Theme) => {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        tokens,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback when a component accidentally renders outside ThemeProvider
    const isDark = false;
    const tokens: ThemeTokens = {
      background: {
        page: "#ffffff",
        shellGradient: "linear-gradient(to bottom, #ffffff, #f1f5f9)",
      },
      text: {
        primary: "#0f172a",
        secondary: "#475569",
      },
    };
    return {
      theme: "light",
      resolvedTheme: "light",
      isDark,
      tokens,
      setTheme: () => {},
    };
  }
  return ctx;
}
