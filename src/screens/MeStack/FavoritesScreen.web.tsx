import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserData } from '../../contexts/UserDataContext';
import { useAudio } from '../../contexts/AudioContext'; // 导入 useAudio

interface FavoriteItem {
  id: string;
  title: string;
  type: 'music' | 'article';
}

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

const TabButton = styled(TouchableOpacity)<{ isActive: boolean }>``;

const TabButtonText = styled.Text<{ isActive: boolean }>`
  font-size: 16px;
  color: ${({ theme, isActive }: { theme: AppTheme; isActive: boolean }) => (isActive ? theme.primaryColor : theme.text)};
  font-weight: 600;
`;

const FavoriteItemContainer = styled(TouchableOpacity)`
  padding: 12px 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: AppTheme }) => theme.borderColor};
`;

const ItemTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const FavoritesScreen = () => {
  const headerHeight = useHeaderHeight();
  const { colors } = useTheme();
  const {
    favoriteArticles,
    favoriteMusic,
    toggleArticleFavorite,
    toggleMusicFavorite,
    clearFavoriteArticles,
    clearFavoriteMusic,
  } = useUserData();

  const [activeTab, setActiveTab] = useState<'music' | 'articles'>('music');
  const navigation = useNavigation();
  const { play } = useAudio(); // 获取 play 方法

  const handleRemove = (item: FavoriteItem) => {
    Alert.alert('删除确认', `确定要删除收藏 "${item.title}" 吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          if (item.type === 'article') {
            toggleArticleFavorite({ id: item.id, title: item.title });
          } else {
            toggleMusicFavorite({ id: item.id, title: item.title });
          }
        },
      },
    ]);
  };

  const handleItemPress = useCallback(async (item: FavoriteItem) => {
    if (item.type === 'article') {
      // @ts-ignore
      navigation.navigate('Reader', { articleId: item.id });
    } else {
      // 点击音乐项目时，直接播放
      play({
        id: item.id, // id 是播放链接
        title: item.title,
        url: item.id, // url 也是播放链接
        artist: '未知艺术家', // 添加默认的 artist
      });
      Toast.show({
        type: 'success',
        text1: '开始播放',
        text2: item.title,
      });
    }
  }, [navigation, play]);

  const clearAllFavorites = useCallback(() => {
    Alert.alert(
      '清空收藏',
      `您确定要清空所有${activeTab === 'music' ? '音乐' : '文章'}收藏记录吗？此操作不可撤销。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            if (activeTab === 'music') {
              clearFavoriteMusic();
            } else {
              clearFavoriteArticles();
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [activeTab, clearFavoriteMusic, clearFavoriteArticles]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={clearAllFavorites} style={{ marginRight: 15 }}>
          <Ionicons name="trash-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors, clearAllFavorites]);

  const musicItems = favoriteMusic.map(item => ({ ...item, type: 'music' as const })).reverse();
  const articleItems = favoriteArticles.map(item => ({ ...item, type: 'article' as const })).reverse();

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <FavoriteItemContainer
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleRemove(item)}
    >
      <ItemTitle>{item.title}</ItemTitle>
    </FavoriteItemContainer>
  );

  const renderList = (items: FavoriteItem[], type: 'music' | 'article') => {
    const emptyText = type === 'music' ? '暂无收藏音乐' : '暂无收藏文章';
    if (items.length === 0) {
      return (
        <EmptyContainer>
          <Ionicons name="heart-dislike-outline" size={80} color={colors.subtleText} />
          <EmptyText>{emptyText}</EmptyText>
        </EmptyContainer>
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
    );
  };

  return (
    <Container style={{ paddingTop: headerHeight - 10 }}>
      <TabContainer>
        <TabButton isActive={activeTab === 'music'} onPress={() => setActiveTab('music')}>
          <TabButtonText isActive={activeTab === 'music'}>音乐</TabButtonText>
        </TabButton>
        <TabButton isActive={activeTab === 'articles'} onPress={() => setActiveTab('articles')}>
          <TabButtonText isActive={activeTab === 'articles'}>文章</TabButtonText>
        </TabButton>
      </TabContainer>

      <View style={{ flex: 1 }}>
        {activeTab === 'music' ? renderList(musicItems, 'music') : renderList(articleItems, 'article')}
      </View>
    </Container>
  );
};

export default FavoritesScreen;