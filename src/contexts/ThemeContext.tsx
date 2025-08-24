
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

// 定义Context的形状
interface ThemeContextData {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentTheme: typeof themes.light;
}

// 定义主题颜色
export const themes = {
  light: {
    background: ['#F4F2FF', '#F2F7FF', '#B4DDE0'],
    text: '#000000',
    card: 'rgba(255, 255, 255, 0.8)',
    // ... 其他浅色主题颜色
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    card: 'rgba(50, 50, 50, 0.8)',
    // ... 其他深色主题颜色
  },
};

// 使用默认值创建Context
const ThemeContext = createContext<ThemeContextData>({
  theme: 'light',
  toggleTheme: () => {},
  currentTheme: themes.light,
});

// 创建Provider组件
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
        console.error('加载主题失败', error);
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
      console.error('保存主题失败', error);
    }
  };

  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// 用于使用Theme Context的自定义Hook
export const useTheme = () => useContext(ThemeContext);
