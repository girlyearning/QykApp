import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

export type Theme = 'light' | 'pink' | 'iridescent' | 'dark' | 'dark-purple' | 'lime-green' | 'hot-pink-paradise' | 'blackout' | 'pink-blackout' | 'baby-blue' | 'dark-purple-night' | 'coffee-core';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('qyk-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-pink', 'theme-iridescent', 'theme-dark', 'theme-dark-purple', 'theme-lime-green', 'theme-hot-pink-paradise', 'theme-blackout', 'theme-pink-blackout', 'theme-baby-blue', 'theme-dark-purple-night', 'theme-coffee-core');
    
    // Add current theme class
    root.classList.add(`theme-${theme}`);
    
    // Handle dark mode utilities for dark-like themes
    if (theme === 'dark' || theme === 'blackout' || theme === 'pink-blackout' || theme === 'dark-purple-night') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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