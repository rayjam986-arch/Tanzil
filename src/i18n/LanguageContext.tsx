import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type Language } from './translations';

type TranslationObj = typeof translations['ar'];

interface LanguageContextType {
  lang: Language;
  t: TranslationObj;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('wahy-lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const isRtl = lang === 'ar';
  const t = translations[lang];

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('wahy-lang', newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, toggleLang, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
