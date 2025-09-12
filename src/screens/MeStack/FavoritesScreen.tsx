import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native'; // 移除 TouchableOpacity
import styled from 'styled-components/native';
import { useTheme, AppTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons'; // 重新导入 Ionicons
import { useNavigation } from '@react-navigation/native'; // 导入 useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../../types/track'; // 导入 Track 类型

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.backgroundColor};
`;

const EmptyContainer = styled.View`
  flex: 1;
`;

const EmptyIcon = styled.View`
  margin-bottom: 10px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
`;

const FavoriteItemContainer = styled.View`
  padding: 12px 0px; /* 上下12px，左右0px */
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: AppTheme }) => theme.borderColor};
`;

const TrackTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const FavoritesScreen = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { colors } = useTheme();

  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // 获取 navigation 对象

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('favoriteTracks');
        const loadedTracks: Track[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        setFavoriteTracks(loadedTracks.reverse()); // 倒序
      } catch (e) {
        console.error('Failed to load favorite tracks.', e);
      } finally {
        setLoading(false);
      }
    };

    // 在组件挂载和每次进入屏幕时重新加载收藏列表
    const unsubscribe = navigation.addListener('focus', loadFavorites);

    return unsubscribe;
  }, [navigation]); // 依赖 navigation 变化

  const renderItem = ({ item }: { item: Track }) => (
    <FavoriteItemContainer>
      <TrackTitle>{item.title}</TrackTitle>
    </FavoriteItemContainer>
  );

  if (loading) {
    return (
      <EmptyContainer style={{ paddingTop: headerHeight }}>
        <EmptyText>加载中...</EmptyText>
      </EmptyContainer>
    );
  }

  if (favoriteTracks.length === 0) {
    return (
      <EmptyContainer style={{ paddingTop: headerHeight }}>
        <Ionicons name="heart-dislike-outline" size={80} color={colors.subtleText} /> {/* 直接使用 Ionicons */}
        <EmptyText>收藏夹空空如也</EmptyText>
      </EmptyContainer>
    );
  }

  return (
    <Container style={{ paddingTop: headerHeight - 10 }}>
      <FlatList
        data={favoriteTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
    </Container>
  );
};

export default FavoritesScreen;