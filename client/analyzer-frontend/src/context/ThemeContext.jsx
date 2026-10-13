import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("resumeos-theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (e) {
      console.warn("Could not read theme from localStorage", e);
    }
    return "dark";
  });

  useEffect(() => {
    try {
      localStorage.setItem("resumeos-theme", theme);
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }

    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    if (theme === "light") {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}
