
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColor] = useState<string>('');

  useEffect(() => {
    // Load theme color from localStorage on mount
    const savedThemeColor = localStorage.getItem('schoolThemeColor');
    if (savedThemeColor) {
      setThemeColor(savedThemeColor);
      document.documentElement.style.setProperty('--primary', savedThemeColor);
    }
  }, []);

  const updateThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem('schoolThemeColor', color);
    document.documentElement.style.setProperty('--primary', color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor: updateThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
