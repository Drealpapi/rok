"use client";

import * as React from "react";

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
  // Default is dark — only override if user has explicitly stored "light"
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    const stored = localStorage.getItem("orbyte-theme") as Theme | null;
    if (stored === "light") {
      // User explicitly chose light — honour it
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      // Stored "dark", stored nothing, or stored anything else → dark
      setTheme("dark");
      document.documentElement.classList.add("dark");
      if (!stored) {
        // Persist the default so future loads are instant
        localStorage.setItem("orbyte-theme", "dark");
      }
    }
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("orbyte-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
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
