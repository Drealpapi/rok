"use client";

import * as React from "react";

/*
 * Theme is handled entirely via CSS classes on <html>.
 * The beforeInteractive script in layout.tsx sets the class immediately
 * on page load (before paint) from localStorage — no flash.
 *
 * This hook/context simply gives components a way to read and toggle
 * the current theme in React state. It does NOT do any localStorage
 * or DOM access during render — only inside event handlers and useEffect —
 * so it never blocks static prerendering.
 */

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /*
   * State initialises to "dark" on both server and client first render.
   * We sync with localStorage in useEffect (client-only) to avoid
   * hydration mismatches and prerender blocks.
   */
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    // Read what the beforeInteractive script already set
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try { localStorage.setItem("orbyte-theme", next); } catch { /* noop */ }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
