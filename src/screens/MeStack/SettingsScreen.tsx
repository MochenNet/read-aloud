import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderTitle, useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.backgroundColor};
`;

const Section = styled.View`
  margin-top: 30;
  margin-horizontal: 20;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const MenuList = styled.View`
  background-color: ${({ theme }: { theme: AppTheme }) => theme.cardBackground};
  border-radius: 10px;
  overflow: hidden;
`;

const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: AppTheme }) => theme.borderColor};
`;

const MenuItemText = styled.Text`
  font-size: 18px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const SegmentedControl = styled.View`
  flex-direction: row;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.borderColor};
  border-radius: 8px;
  padding: 2px;
`;

const SegmentedOption = styled(TouchableOpacity)<{ isActive: boolean }>`
  flex: 1;
  padding: 8px;
  border-radius: 7px;
  background-color: ${({ theme, isActive }: { theme: AppTheme, isActive: boolean }) => (isActive ? theme.cardBackground : 'transparent')};
`;

const SegmentedText = styled.Text<{ isActive: boolean }>`
  text-align: center;
  font-size: 14px;
  color: ${({ theme, isActive }: { theme: AppTheme, isActive: boolean }) => (isActive ? theme.text : theme.subtleText)};
`;

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { setScheme, scheme } = useTheme();

  return (
    <Container contentContainerStyle={{ paddingTop: headerHeight - 30, paddingBottom: insets.bottom }}>
      <Section>
        <SectionTitle >外观</SectionTitle>
        <MenuList>
          <MenuItem>
            {/* <MenuItemText>主题</MenuItemText> */}
            <SegmentedControl>
              <SegmentedOption isActive={scheme === 'system'} onPress={() => setScheme('system')}>
                <SegmentedText isActive={scheme === 'system'}>自动</SegmentedText>
              </SegmentedOption>
              <SegmentedOption isActive={scheme === 'light'} onPress={() => setScheme('light')}>
                <SegmentedText isActive={scheme === 'light'}>浅色</SegmentedText>
              </SegmentedOption>
              <SegmentedOption isActive={scheme === 'dark'} onPress={() => setScheme('dark')}>
                <SegmentedText isActive={scheme === 'dark'}>深色</SegmentedText>
              </SegmentedOption>
            </SegmentedControl>
          </MenuItem>
        </MenuList>
      </Section>
    </Container>
  );
};

export default SettingsScreen;