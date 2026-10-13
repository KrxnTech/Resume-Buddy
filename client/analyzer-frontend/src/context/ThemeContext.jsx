import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const theme = "light";

  useEffect(() => {
    try {
      localStorage.setItem("resumeos-theme", "light");
    } catch (e) {
      // ignore
    }

    document.documentElement.setAttribute("data-theme", "light");
    document.body.setAttribute("data-theme", "light");
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {}, setTheme: () => {}, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
}
