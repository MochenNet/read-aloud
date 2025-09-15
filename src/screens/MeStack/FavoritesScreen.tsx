import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import * as Clipboard from 'expo-clipboard'; // 导入 Clipboard
import Toast from 'react-native-toast-message'; // 导入 Toast
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons'; // 重新导入 Ionicons
import { useNavigation } from '@react-navigation/native'; // 导入 useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../../types/track'; // 导入 Track 类型
import { Article } from '../../types/article'; // 导入 Article 类型
import PagerView from 'react-native-pager-view'; // 导入 PagerView

type FavoriteItem = (Track | Article) & { type: 'music' | 'article' };

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.backgroundColor};
`;

const EmptyContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.backgroundColor};
  justify-content: center;
  align-items: center;
`;

const EmptyIcon = styled.View`
  margin-bottom: 10px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
`;

const TabContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: AppTheme }) => theme.borderColor};
`;

const TabButton = styled(TouchableOpacity)<{ isActive: boolean }>`
  
`;

const TabButtonText = styled.Text<{ isActive: boolean }>`
  font-size: 16px;
  color: ${({ theme, isActive }: { theme: AppTheme; isActive: boolean }) => (isActive ? theme.primaryColor : theme.text)};
  font-weight: 600;
`;

const FavoriteItemContainer = styled(TouchableOpacity)`
  padding: 12px 0px; /* 上下12px，左右0px */
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: AppTheme }) => theme.borderColor};
`;

const ItemTitle = styled.Text`
  font-size: 12px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const FavoritesScreen = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<'music' | 'articles'>('music');
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [pagerIndex, setPagerIndex] = useState(0); // Add pager index state
  const pagerViewRef = useRef<PagerView>(null);

  const clearAllFavorites = useCallback(async () => {
    Alert.alert(
      '清空收藏',
      `您确定要清空所有${activeTab === 'music' ? '音乐' : '文章'}收藏记录吗？此操作不可撤销。`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              const key = activeTab === 'music' ? 'favoriteTracks' : 'favoriteArticles';
              await AsyncStorage.removeItem(key);
              setFavoriteItems(prevItems => prevItems.filter(item => item.type !== activeTab));
              Toast.show({
                type: 'success',
                text1: '已清空',
                text2: `所有${activeTab === 'music' ? '音乐' : '文章'}收藏记录已成功清空`,
              });
            } catch (e) {
              console.error(`Failed to clear all ${activeTab} favorite tracks/articles.`, e);
              Toast.show({
                type: 'error',
                text1: '清空失败',
                text2: `清空${activeTab === 'music' ? '音乐' : '文章'}收藏记录时发生错误`,
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [activeTab]);

  const removeFavorite = useCallback(async (itemId: string, itemType: 'music' | 'article') => {
    try {
      const key = itemType === 'music' ? 'favoriteTracks' : 'favoriteArticles';
      const jsonValue = await AsyncStorage.getItem(key);
      let currentItems: (Track | Article)[] = jsonValue != null ? JSON.parse(jsonValue) : [];
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(key, JSON.stringify(updatedItems));

      setFavoriteItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.type === itemType)));

      Toast.show({
        type: 'success',
        text1: '记录已删除',
        text2: '收藏记录已成功移除',
      });
    } catch (e) {
      console.error('Failed to remove favorite item.', e);
      Toast.show({
        type: 'error',
        text1: '删除失败',
        text2: '移除收藏记录时发生错误',
      });
    }
  }, []);

  const handleLongPress = useCallback(async (item: FavoriteItem) => {
    await Clipboard.setStringAsync(item.title);
    Toast.show({
      type: 'success',
      text1: '已复制',
      text2: '标题已复制到剪贴板',
    });
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const musicJson = await AsyncStorage.getItem('favoriteTracks');
        const articleJson = await AsyncStorage.getItem('favoriteArticles');

        const loadedMusic: Track[] = musicJson != null ? JSON.parse(musicJson) : [];
        const loadedArticles: Article[] = articleJson != null ? JSON.parse(articleJson) : [];

        const combinedFavorites: FavoriteItem[] = [
          ...loadedMusic.map(track => ({ ...track, type: 'music' as const })),
          ...loadedArticles.map(article => ({ ...article, type: 'article' as const })),
        ];

        setFavoriteItems(combinedFavorites.reverse()); // 倒序
      } catch (e) {
        console.error('Failed to load favorite items.', e);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadFavorites);

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={clearAllFavorites} style={{ marginRight: 15 }}>
          <Ionicons name="trash-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });

    return unsubscribe;
  }, [navigation, colors, clearAllFavorites]);

  const filteredMusicItems = favoriteItems.filter(item => item.type === 'music');
  const filteredArticleItems = favoriteItems.filter(item => item.type === 'article');

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <FavoriteItemContainer onLongPress={() => handleLongPress(item)}>
      <ItemTitle>{item.title}</ItemTitle>
    </FavoriteItemContainer>
  );

  return (
    <Container style={{ paddingTop: headerHeight - 10 }}>
      <TabContainer>
        <TabButton isActive={activeTab === 'music'} onPress={() => { setActiveTab('music'); pagerViewRef.current?.setPage(0); }}>
          <TabButtonText isActive={activeTab === 'music'}>音乐</TabButtonText>
        </TabButton>
        <TabButton isActive={activeTab === 'articles'} onPress={() => { setActiveTab('articles'); pagerViewRef.current?.setPage(1); }}>
          <TabButtonText isActive={activeTab === 'articles'}>文章</TabButtonText>
        </TabButton>
      </TabContainer>

      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={e => {
          setPagerIndex(e.nativeEvent.position);
          setActiveTab(e.nativeEvent.position === 0 ? 'music' : 'articles');
        }}
      >
        <View key="0" style={{ flex: 1 }}>
          {loading ? (
            <EmptyContainer>
              <EmptyText>加载中...</EmptyText>
            </EmptyContainer>
          ) : filteredMusicItems.length === 0 ? (
            <EmptyContainer>
              <Ionicons name="heart-dislike-outline" size={80} color={colors.subtleText} />
              <EmptyText>暂无收藏音乐</EmptyText>
            </EmptyContainer>
          ) : (
            <FlatList
              data={filteredMusicItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            />
          )}
        </View>
        <View key="1" style={{ flex: 1 }}>
          {loading ? (
            <EmptyContainer>
              <EmptyText>加载中...</EmptyText>
            </EmptyContainer>
          ) : filteredArticleItems.length === 0 ? (
            <EmptyContainer>
              <Ionicons name="heart-dislike-outline" size={80} color={colors.subtleText} />
              <EmptyText>暂无收藏文章</EmptyText>
            </EmptyContainer>
          ) : (
            <FlatList
              data={filteredArticleItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            />
          )}
        </View>
      </PagerView>
    </Container>
  );
};

export default FavoritesScreen;