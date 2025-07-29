import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, themes } from '../contexts/ThemeContext';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: ${props => props.theme.text};
  font-size: 24px;
`;

const MeScreen = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  if (theme === 'light') {
    return (
      <LinearGradient colors={currentTheme.background} style={{ flex: 1 }}>
        <Container>
          <Title>Me Screen</Title>
        </Container>
      </LinearGradient>
    );
  }

  return (
    <Container style={{ backgroundColor: currentTheme.background }}>
      <Title>Me Screen</Title>
    </Container>
  );
};

export default MeScreen;