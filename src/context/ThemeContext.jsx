// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useInfoContext } from "./infoContext";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useInfoContext();

  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // currentUser.mode bo‘lsa, theme shu bo‘lishi kerak
  // useEffect(() => {
  //   if (currentUser?.mode) {
  //     setTheme(currentUser.mode);
  //     localStorage.setItem("theme", currentUser.mode);
  //   }
  // }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
