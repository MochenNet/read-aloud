import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.backgroundColor};
`;

const AppName = styled.Text`
  font-size: 36px;
  font-weight: bold;
  font-family: 'TaoBaoMaiCaiTi';
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  margin-bottom: 10px;
`;

const VersionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
  margin-bottom: 20px;
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  text-align: left;
  padding-horizontal: 40px;
  margin-bottom: 20px;
`;

const AboutScreen = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return (
    <Container style={{ paddingTop: headerHeight }}>
      <AppName>乐  读</AppName>
      <VersionText>版本 1.0.0</VersionText>
      <DescriptionText>
        {"\u3000\u3000"}本应用源自“钢琴书屋”，用音乐 + 文字的展示形式，打造一个心灵的避风港。
      </DescriptionText>
      <DescriptionText>
        {"\u3000\u3000"}在这里，音乐轻柔流淌，文字洗涤灵魂，让您在阅读中沉思，在思考中享受生活，寻回内心的宁静与力量。
      </DescriptionText>
      <DescriptionText>
        {"\u3000\u3000"}本软件完全免费，无广告，无追踪，无隐私。
      </DescriptionText>
      <DescriptionText>
        {"\u3000\u3000"}致力于提供一个纯粹、沉浸的阅读与声音体验。
      </DescriptionText>
    </Container>
  );
};

export default AboutScreen;