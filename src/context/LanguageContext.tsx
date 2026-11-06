'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'KN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('ticketease_lang') as Language;
    if (saved === 'EN' || saved === 'KN') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ticketease_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'EN' ? 'KN' : 'EN';
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

