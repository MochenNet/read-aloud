import React from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, themes } from '../../contexts/ThemeContext';
import DailyCard from '../../components/specific/DailyCard';
import { useUserData } from '../../contexts/UserDataContext';
import { useAudio } from '../../contexts/AudioContext';

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
  const { theme } = useTheme();
  const { favorites, toggleFavorite } = useUserData();
  const { play } = useAudio();

  // 临时的假数据
  const dummyArticle = {
    id: '1',
    title: '每日一读',
    text: '“宇宙的尽头是考公上岸。” 这句话虽然是句玩笑，但也道出了当下许多人的无奈与辛酸。',
    imageUrl: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // 示例图片
    audioUrl: '' // 后面需要一个真实的音频URL
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

  const renderContent = () => (
    <DailyCard 
      imageUrl={dummyArticle.imageUrl}
      title={dummyArticle.title}
      text={dummyArticle.text}
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavorite(dummyArticle.id)}
      onPlay={handlePlay}
    />
  );

  if (theme === 'light') {
    return (
      <FullScreenLinearGradient colors={themes.light.background}>
        {renderContent()}
      </FullScreenLinearGradient>
    );
  }

  return (
    <Container>
      {renderContent()}
    </Container>
  );
};

export default HomeScreen;