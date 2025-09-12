import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => (Array.isArray(theme.background) ? theme.background[0] : theme.background)};
  align-items: center;
  justify-content: center;
`;

const AppName = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  margin-bottom: 10px;
`;

const VersionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
  margin-bottom: 20px;
`;

const DescriptionText = styled.Text`
  font-size: 14px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  text-align: center;
  padding-horizontal: 40px;
`;

const AboutScreen = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return (
    <Container style={{ paddingTop: headerHeight }}>
      <AppName>阅声</AppName>
      <VersionText>版本 1.0.0</VersionText>
      <DescriptionText>
        致力于提供一个纯粹、沉浸的文字与声音体验。
      </DescriptionText>
    </Container>
  );
};

export default AboutScreen;