import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserDataProvider } from './src/contexts/UserDataContext';
import { AudioProvider } from './src/contexts/AudioContext';
import AppNavigator from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserDataProvider>
          <AudioProvider>
            <AppNavigator />
          </AudioProvider>
        </UserDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}