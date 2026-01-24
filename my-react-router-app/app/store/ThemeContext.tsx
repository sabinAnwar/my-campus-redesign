import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: "light" | "dark";
  isDark: boolean;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "iu-theme",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  // SSR-safe initial state (light by default, system resolved on client)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (defaultTheme === "system") return "light"; // SSR fallback
    return defaultTheme === "dark" ? "dark" : "light";
  });

  // Load persisted theme on client and handle "system" preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const stored = window.localStorage.getItem(storageKey) as
      | "light"
      | "dark"
      | "system"
      | null;
    
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (stored === "system" || defaultTheme === "system") {
      // Resolve system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [storageKey, defaultTheme]);

  const isDark = theme === "dark";

  // Update html class + persist
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    window.localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

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
    return {
      theme: "light" as const,
      isDark: false,
      setTheme: () => {},
    };
  }
  return ctx;
}
