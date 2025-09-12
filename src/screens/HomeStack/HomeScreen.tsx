import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, SafeAreaView, Platform, Text, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import DailyCard from '../../components/specific/DailyCard';
import { useAudio } from '../../contexts/AudioContext';
import { HomeStackParamList } from '../../navigation';
import { Article } from '../../types/article';
import { articles } from '../../data/articles';
import { fetchRandomImageUrl, fetchRandomMusic } from '../../api';
import RandomMusicPlayer from '../../components/specific/RandomMusicPlayer';
import { musicTracks } from '../../data/music';
import { Track } from '../../types/track';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

// Styled Components
const ThemedContainer = styled(View)`
  flex: 1;
  background-color: ${(props: { theme: { background: string } }) => props.theme.background};
`;

const MainContent = styled(SafeAreaView)`
  flex: 1;
  padding-top: ${Platform.OS === 'android' ? '25' : '0'};
`;

const Header = styled.View`
  paddingVertical: 10;
  paddingHorizontal: 20;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AppName = styled.Text`
  font-size: 36;
  color: ${(props: { theme: { text: string } }) => props.theme.text};
  font-family: 'TaoBaoMaiCaiTi';
`;

const DateDisplay = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const Day = styled.Text`
  font-size: 30;
  font-weight: 500;
  color: ${(props: { theme: { text: string } }) => props.theme.text};
`;

const Month = styled.Text`
  font-size: 16;
  font-weight: 300;
  margin-left: 5;
  margin-bottom: 5;
  color: ${(props: { theme: { text: string } }) => props.theme.text};
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  paddingHorizontal: 20;
`;

// Create a default article for the initial render
const initialArticle: Article = {
  id: 'initial-placeholder', // Use a special ID to identify the initial state
  title: '', // Title and author will be handled by the loading state in the card
  author: '',
  text: '',
  audioUrl: '',
  imageUrl: undefined, // No network image initially, so the card will use local one
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, currentTheme } = useTheme();
  const { play, stop, currentTrack, setCurrentTrack } = useAudio();
  const [dailyArticle, setDailyArticle] = useState<Article>(initialArticle);

  const loadDailyData = useCallback(async (retryCount = 0) => {
    try {
        const randomIndex = Math.floor(Math.random() * articles.length);
        const article = articles[randomIndex];
        const imageUrl = await fetchRandomImageUrl();
        setDailyArticle({ ...article, imageUrl: imageUrl || undefined });
    } catch (error) {
        if (retryCount < 2) {
            loadDailyData(retryCount + 1); // 重试最多2次
        } else {
            console.error('Failed to load daily data after retries:', error);
            setDailyArticle({ ...articles[0], imageUrl: undefined }); // 回退到默认文章
        }
    }
}, []);

  useFocusEffect(
    useCallback(() => {
      // Only load network data if it's the initial placeholder article
      if (dailyArticle.id === 'initial-placeholder') {
        loadDailyData();
      }
    }, [dailyArticle, loadDailyData])
  );

  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('zh-CN', { month: 'long' });

  const handlePlayArticle = () => {
    if (!dailyArticle || !dailyArticle.audioUrl) return;
    play({
      id: dailyArticle.id,
      url: dailyArticle.audioUrl,
      title: dailyArticle.title,
      artist: dailyArticle.author,
    } as Track);
  };

  const handleCardPress = () => {
    if (!dailyArticle || dailyArticle.id === 'initial-placeholder') return;
    navigation.navigate('Reader', { articleId: dailyArticle.id });
  };

  const handleRandomizeMusic = async () => {
    try {
      const musicData = await fetchRandomMusic();
      if (musicData) {
        play({
          id: musicData.url,
          url: musicData.url,
          title: musicData.title,
          artist: '随机音乐'
        });
      }
    } catch (error) {
      console.error('Failed to fetch random music:', error);
      // 回退到本地音乐列表
      const randomIndex = Math.floor(Math.random() * musicTracks.length);
      play(musicTracks[randomIndex]);
    }
  };

  const [isInitialMusicLoaded, setIsInitialMusicLoaded] = useState(false);
  
  useEffect(() => {
    const loadInitialMusic = async () => {
      try {
        const musicData = await fetchRandomMusic();
        if (musicData) {
          setCurrentTrack({
            id: musicData.url,
            url: musicData.url,
            title: musicData.title,
            artist: '随机音乐'
          });
        }
      } catch (error) {
        console.error('Failed to fetch initial music:', error);
        const randomIndex = Math.floor(Math.random() * musicTracks.length);
        setCurrentTrack(musicTracks[randomIndex]);
      }
    };
  
    if (!isInitialMusicLoaded && !currentTrack) {
      loadInitialMusic();
      setIsInitialMusicLoaded(true);
    }
  }, [isInitialMusicLoaded, currentTrack, setCurrentTrack]);

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
        <RandomMusicPlayer onRandomize={handleRandomizeMusic} />
        <DailyCard
          article={dailyArticle}
          onPlay={handlePlayArticle}
          onPress={handleCardPress}
          onRandomize={loadDailyData}
        />
      </CardContainer>
    </MainContent>
  );

  if (theme === 'light') {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LinearGradient
          colors={['rgba(183, 245, 255, 1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1.2 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(208, 255, 212, 0.7)', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 1 }}
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