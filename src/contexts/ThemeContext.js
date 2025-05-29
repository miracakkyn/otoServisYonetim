// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

// Context oluştur
export const ThemeContext = createContext();

// Theme provider bileşeni
export const ThemeProvider = ({ children }) => {
  // localStorage'dan tema tercihini al veya varsayılan olarak 'light' kullan
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Tema değiştiğinde localStorage'a kaydet ve body class'ını güncelle
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Body sınıfını güncelle
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Temayı değiştir
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};