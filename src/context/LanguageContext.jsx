// src/context/LanguageContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { translations } from "../translations";
import { useInfoContext } from "./infoContext";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { currentUser } = useInfoContext();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "uz");

  // currentUser.lang bo‘lsa, shu tanlansin
  useEffect(() => {
    if (currentUser?.lang) {
      setLang(currentUser.lang);
      localStorage.setItem("lang", currentUser.lang);
    }
  }, [currentUser]);

  const t = (key) => translations[lang]?.[key] || key;

  const changeLanguage = (lng) => {
    setLang(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
