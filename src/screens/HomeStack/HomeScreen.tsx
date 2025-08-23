import React from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native'; // 引入 View 和 StyleSheet
import { useTheme, themes } from '../../contexts/ThemeContext';
import DailyCard from '../../components/specific/DailyCard';
import { useUserData } from '../../contexts/UserDataContext';
import { useAudio } from '../../contexts/AudioContext';
import { HomeStackParamList } from '../../navigation';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

// FullScreenLinearGradient 不再需要，但保留以防万一
const FullScreenLinearGradient = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${props => props.theme.background};
`;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const { favorites, toggleFavorite } = useUserData();
  const { play } = useAudio();

  // 临时的假数据
  const dummyArticle = {
    id: '1',
    title: '每日一读',
    text: '“宇宙的尽头是考公上岸。” 这句话虽然是句玩笑，但也道出了当下许多人的无奈与辛酸。',
    imageUrl: 'https://img.51miz.com/Element/00/77/82/43/4bf9a605_E778243_ad573585.png', // 示例图片
    audioUrl: 'https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3' // 后面需要一个真实的音频URL
  };

  const isFavorite = favorites.includes(dummyArticle.id);

  const handlePlay = () => {
    play({
      id: dummyArticle.id,
      url: dummyArticle.audioUrl,
      title: dummyArticle.title,
      artist: '阅声'
    });
  };

  const handleCardPress = () => {
    navigation.navigate('Reader', { articleId: dummyArticle.id });
  };

  // 将卡片内容提取到一个函数中，方便复用
  const renderContent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DailyCard
        imageUrl={dummyArticle.imageUrl}
        title={dummyArticle.title}
        text={dummyArticle.text}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavorite(dummyArticle.id)}
        onPlay={handlePlay}
        onPress={handleCardPress}
      />
    </View>
  );

  // 浅色主题使用新的双层渐变背景
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

  // 深色主题保持不变
  return (
    <Container>
      {renderContent()}
    </Container>
  );
};

export default HomeScreen;
