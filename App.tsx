import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserDataProvider } from './src/contexts/UserDataContext';
import AppNavigator from './src/navigation';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// 防止在字体加载完成前自动隐藏启动屏幕
SplashScreen.preventAutoHideAsync();

export default function App() {
  // 加载自定义字体
  const [fontsLoaded, fontError] = useFonts({
    'TaoBaoMaiCaiTi': require('./src/assets/font/TaoBaoMaiCaiTi-Regular.ttf'),
    'FZJuZXFJW': require('./src/assets/font/FangZhengFangSongJianTi.ttf'),
  });

  useEffect(() => {
    // 字体加载成功或失败后，隐藏启动屏幕
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 如果字体正在加载且没有错误，则不渲染任何内容
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 渲染主应用
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserDataProvider>
          <StatusBar style="auto" translucent={true} />
          <AppNavigator />
        </UserDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}