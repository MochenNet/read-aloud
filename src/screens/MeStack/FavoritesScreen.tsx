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
import { useUserData } from '../../contexts/UserDataContext';
import PagerView from 'react-native-pager-view'; // 导入 PagerView

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
  const [pagerIndex, setPagerIndex] = useState(0); // Add pager index state
  const pagerViewRef = useRef<PagerView>(null);

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

  const handleCopy = useCallback(async (item: FavoriteItem) => {
    await Clipboard.setStringAsync(item.title);
    Toast.show({
      type: 'success',
      text1: '已复制',
      text2: '标题已复制到剪贴板',
    });
  }, []);

  const clearAllFavorites = useCallback(() => {
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
      onPress={() => handleCopy(item)} // Tap to copy
      onLongPress={() => handleRemove(item)} // Long press to remove
    >
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
         {musicItems.length === 0 ? (
           <EmptyContainer>
             <Ionicons name="heart-dislike-outline" size={80} color={colors.subtleText} />
             <EmptyText>暂无收藏音乐</EmptyText>
           </EmptyContainer>
         ) : (
           <FlatList
             data={musicItems}
             keyExtractor={(item) => item.id}
             renderItem={renderItem}
             contentContainerStyle={{ paddingHorizontal: 12 }}
           />
         )}
       </View>
       <View key="1" style={{ flex: 1 }}>
         {articleItems.length === 0 ? (
           <EmptyContainer>
             <Ionicons name="heart-dislike-outline" size={80} color={colors.subtleText} />
             <EmptyText>暂无收藏文章</EmptyText>
           </EmptyContainer>
         ) : (
           <FlatList
             data={articleItems}
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