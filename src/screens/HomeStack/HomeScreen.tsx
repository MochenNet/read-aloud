import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, SafeAreaView, Platform, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import DailyCard from '../../components/specific/DailyCard';
import { useUserData } from '../../contexts/UserDataContext';
import { useAudio } from '../../contexts/AudioContext';
import { HomeStackParamList } from '../../navigation';
import { Article } from '../../types/article';
import { articles } from '../../data/articles'; // 导入文章数据

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

// Styled Components
const ThemedContainer = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const MainContent = styled(SafeAreaView)`
  flex: 1;
  padding-top: ${Platform.OS === 'android' ? '25px' : '0'};
`;

const Header = styled.View`
  padding: 10px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AppName = styled.Text`
  font-size: 32px;
  color: ${props => props.theme.text};
  font-family: 'TaoBaoMaiCaiTi'; /* 使用自定义字体 */
`;

const DateDisplay = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const Day = styled.Text`
  font-size: 30px;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const Month = styled.Text`
  font-size: 16px;
  font-weight: 300;
  margin-left: 5px;
  margin-bottom: 5px; /* Aligns with the bottom of the day number */
  color: ${props => props.theme.text};
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: flex-start; /* Align card to the top */
  align-items: center;
  padding: 20px; /* Add top padding */
`;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, currentTheme } = useTheme();
  const { favorites, toggleFavorite } = useUserData();
  const { play } = useAudio();
  const [dailyArticle, setDailyArticle] = useState<Article | null>(null);

  // 组件加载时随机选择一篇文章
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * articles.length);
    setDailyArticle(articles[randomIndex]);
  }, []);

  // 获取当前日期
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('zh-CN', { month: 'long' });

  const handlePlay = () => {
    if (!dailyArticle) return;
    play({
      id: dailyArticle.id,
      url: dailyArticle.audioUrl, // 注意：当前数据中没有 audioUrl，需要补充
      title: dailyArticle.title,
      artist: dailyArticle.author
    });
  };

  const handleCardPress = () => {
    if (!dailyArticle) return;
    navigation.navigate('Reader', { articleId: dailyArticle.id });
  };

  const renderContent = () => (
    <MainContent>
      <Header>
        <AppName theme={currentTheme}>阅·声</AppName>
        <DateDisplay>
          <Day theme={currentTheme}>{day}</Day>
          <Month theme={currentTheme}>/ {month}</Month>
        </DateDisplay>
      </Header>
      <CardContainer>
        {dailyArticle ? (
          <DailyCard
            article={dailyArticle}
            onPlay={handlePlay}
            onPress={handleCardPress}
          />
        ) : (
          // 在文章加载前可以显示一个占位符
          <View><Text>加载中...</Text></View>
        )}
      </CardContainer>
    </MainContent>
  );

  if (theme === 'light') {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LinearGradient
          colors={['rgba(224, 247, 250, 0.7)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(232, 245, 233, 0.7)', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        {renderContent()}
      </View>
    );
  }

  return (
    <ThemedContainer theme={currentTheme}>
      {renderContent()}
    </ThemedContainer>
  );
};

export default HomeScreen;