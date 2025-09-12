import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

// Define the shape of the theme objects
export const themes = {
  light: {
    backgroundColor: '#F4F2FF',
    background: ['#F4F2FF', '#F2F7FF', '#B4DDE0'],
    text: '#000000',
    card: 'rgba(255, 255, 255, 0.8)',
    subtleText: '#666666',
    borderColor: '#EEEEEE',
    cardBackground: 'rgba(255, 255, 255, 0.7)',
    wechatColor: '#28C445',
  },
  dark: {
    backgroundColor: '#121212',
    background: ['#121212'],
    text: '#FFFFFF',
    card: 'rgba(50, 50, 50, 0.8)',
    subtleText: '#AAAAAA',
    borderColor: '#333333',
    cardBackground: 'rgba(50, 50, 50, 0.8)',
    wechatColor: '#28C445',
  },
};

export type AppTheme = typeof themes.light;

interface ThemeContextData {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: AppTheme;
}

const ThemeContext = createContext<ThemeContextData>({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: themes.light,
});

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemScheme || 'light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as 'light' | 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  const currentTheme = themes[theme];
  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors: currentTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the Theme Context
export const useTheme = () => useContext(ThemeContext);
