import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import DailyCard from '../../components/specific/DailyCard';
import { useAudio } from '../../contexts/AudioContext';
import { HomeStackParamList } from '../../navigation';
import { Article } from '../../types/article';
import { articles } from '../../data/articles';
import { fetchRandomImageUrl, fetchRandomMusic } from '../../api';
import RandomMusicPlayer from '../../components/specific/RandomMusicPlayer';
import { musicTracks } from '../../data/music';
import { Track } from '../../types/track';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

// Styled Components
const ThemedContainer = styled(View)`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => (Array.isArray(theme.background) ? theme.background[0] : theme.background)};
`;

const MainContent = styled.View`
  flex: 1;
`;

const Header = styled(TouchableOpacity)`
  paddingVertical: 10;
  paddingHorizontal: 20;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AppName = styled.Text`
  font-size: 36px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  font-family: 'TaoBaoMaiCaiTi';
`;

const DateDisplay = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const Day = styled.Text`
  font-size: 30px;
  font-weight: 500;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const Month = styled.Text`
  font-size: 16px;
  font-weight: 300;
  margin-left: 5px;
  margin-bottom: 5px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  paddingHorizontal: 20px;
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
  const { isDarkMode, colors } = useTheme();
  const { play, stop, currentTrack, setCurrentTrack } = useAudio();
  const [dailyArticle, setDailyArticle] = useState<Article>(initialArticle);
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000); // 1秒后自动关闭
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const loadDailyData = useCallback(async (retryCount = 0) => {
    setIsRandomizing(true);
    try {
        const randomIndex = Math.floor(Math.random() * articles.length);
        const article = articles[randomIndex];
        const imageUrl = await fetchRandomImageUrl();
        setDailyArticle({ ...article, imageUrl: imageUrl || undefined });
    } catch (error) {
        if (retryCount < 2) {
            loadDailyData(retryCount + 1); // Retry up to 2 times
        } else {
            console.error('Failed to load daily data after retries:', error);
            setDailyArticle({ ...articles[0], imageUrl: undefined }); // Fallback to a default article
        }
    } finally {
        setIsRandomizing(false);
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

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (dailyArticle && dailyArticle.id !== 'initial-placeholder') {
        try {
          const favoritesJson = await AsyncStorage.getItem('favoriteArticles');
          const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
          const isCurrentlyFavorite = favorites.some((article: any) => article.id === dailyArticle.id);
          setIsFavorite(isCurrentlyFavorite);
        } catch (error) {
          console.error('Failed to load article favorites', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [dailyArticle]);

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

  const handleShare = async () => {
    if (!dailyArticle || dailyArticle.id === 'initial-placeholder') return;
    try {
      await Share.share({
        message: `推荐你阅读一篇文章：《${dailyArticle.title}》 - ${dailyArticle.author}`,
        url: 'https://read.hfabe.com', // Replace with a real URL if available
        title: `乐读 - 《${dailyArticle.title}》`
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!dailyArticle || dailyArticle.id === 'initial-placeholder') return;

    try {
      const favoritesJson = await AsyncStorage.getItem('favoriteArticles');
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      if (isFavorite) {
        favorites = favorites.filter((article: any) => article.id !== dailyArticle.id);
        Toast.show({ type: 'info', text1: '文章已取消收藏' });
      } else {
        const { id, title, author } = dailyArticle;
        favorites.push({ id, title, author });
        Toast.show({ type: 'success', text1: '文章收藏成功' });
      }

      // 确保只存储必要的字段，防止 CursorWindow 错误
      const sanitizedFavorites = favorites.map((item: { id: string; title: string; author: string; }) => ({ id: item.id, title: item.title, author: item.author }));
      await AsyncStorage.setItem('favoriteArticles', JSON.stringify(sanitizedFavorites));
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle article favorite', error);
    }
  };

  const handleRandomizeMusic = async (callback?: () => void) => {
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
      // Fallback to local music list
      const randomIndex = Math.floor(Math.random() * musicTracks.length);
      play(musicTracks[randomIndex]);
    } finally {
      if (callback) {
        callback();
      }
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

  const handleHeaderPress = async () => {
    try {
      const response = await fetch('https://api.mu-jie.cc/stray-birds?type=json');
      const result = await response.json();
      console.log('Hitokoto:', result);
      
      if (result.cn) {
        setModalContent(result.cn);
        setShowModal(true);
      } else {
        setModalContent('获取一言失败');
        setShowModal(true);
      }
    } catch (error) {
      setModalContent('网络请求失败');
      setShowModal(true);
    }
  };

  const renderContent = () => (
    <MainContent style={{ paddingTop: insets.top }}>
      <Header onPress={handleHeaderPress}>
        <AppName>乐·读</AppName>
        <DateDisplay>
          <Day>{day}</Day>
          <Month>/ {month}</Month>
        </DateDisplay>
      </Header>
      <CardContainer>
        <RandomMusicPlayer onRandomize={handleRandomizeMusic} />
        <DailyCard
          article={dailyArticle}
          onPlay={handlePlayArticle}
          onPress={handleCardPress}
          onRandomize={loadDailyData}
          onShare={handleShare}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          isRandomizing={isRandomizing}
        />
      </CardContainer>
    </MainContent>
  );

  return (
    <ThemedContainer>
      {!isDarkMode && (
        <>
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
        </>
      )}
      {renderContent()}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={modalStyles.centeredView}
          activeOpacity={1}
          onPress={() => setShowModal(false)} // 点击任何地方都能关闭
        >
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>{modalContent}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedContainer>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // 底部对齐
    alignItems: 'center',
    backgroundColor: 'transparent', // 透明背景，不遮罩整个屏幕
    paddingBottom: 50, // 从底部向上偏移
  },
  modalView: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 深色半透明背景
    borderRadius: 10, // 圆角为20
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'transparent', // 去掉阴影
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    minWidth: 200,
    maxWidth: '80%',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff', // 白色字体
    lineHeight: 20,
  },
});

export default HomeScreen;