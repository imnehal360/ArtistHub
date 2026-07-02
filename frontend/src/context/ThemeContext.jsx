import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Dark theme only — hardlocked, no toggle
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    document.body.classList.add('dark');
    document.body.style.backgroundColor = 'var(--bg-0, #030309)';
    // Clear any stale light-mode preference
    localStorage.removeItem('theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {}, isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
