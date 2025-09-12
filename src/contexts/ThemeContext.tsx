import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

// Define the shape of the theme objects
export const themes = {
  light: {
    backgroundColor: '#F2F7FF',
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
  setScheme: (scheme: 'light' | 'dark' | 'system') => void;
  scheme: 'light' | 'dark' | 'system';
  colors: AppTheme;
}

const ThemeContext = createContext<ThemeContextData>({
  isDarkMode: false,
  setScheme: () => {},
  scheme: 'system',
  colors: themes.light,
});

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [scheme, setSchemeState] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const loadScheme = async () => {
      try {
        const savedScheme = await AsyncStorage.getItem('colorScheme');
        if (savedScheme) {
          setSchemeState(savedScheme as 'light' | 'dark' | 'system');
        }
      } catch (error) {
        console.error('Failed to load scheme', error);
      }
    };
    loadScheme();
  }, []);

  const setScheme = async (newScheme: 'light' | 'dark' | 'system') => {
    setSchemeState(newScheme);
    try {
      await AsyncStorage.setItem('colorScheme', newScheme);
    } catch (error) {
      console.error('Failed to save scheme', error);
    }
  };

  const theme = scheme === 'system' ? (systemScheme || 'light') : scheme;
  const currentTheme = themes[theme];
  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ isDarkMode, setScheme, scheme, colors: currentTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the Theme Context
export const useTheme = () => useContext(ThemeContext);
