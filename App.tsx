import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserDataProvider } from './src/contexts/UserDataContext';
import { AudioProvider } from './src/contexts/AudioContext';
import AppNavigator from './src/navigation';

export default function App() {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <AudioProvider>
          <AppNavigator />
        </AudioProvider>
      </UserDataProvider>
    </ThemeProvider>
  );
}

