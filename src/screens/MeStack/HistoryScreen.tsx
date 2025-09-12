import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => (Array.isArray(theme.background) ? theme.background[0] : theme.background)};
  align-items: center;
  justify-content: center;
`;

const EmptyIcon = styled(Ionicons)`
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
  margin-bottom: 20px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
`;

const HistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return (
    <Container style={{ paddingTop: headerHeight }}>
      <EmptyIcon name="time-outline" size={80} />
      <EmptyText>还没有收听历史</EmptyText>
    </Container>
  );
};

export default HistoryScreen;