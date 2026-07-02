import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Default to dark mode for premium look
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0a0f'; // rich dark brand background
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc'; // slate 50
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
