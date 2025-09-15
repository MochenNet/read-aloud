import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, ScrollView, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from '../../contexts/AudioContext';
import { useTheme } from '../../contexts/ThemeContext';

// Styled Components
const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 20px;
  margin-vertical: 20px;
  width: 100%;
  height: 60px;
  background-color: ${({ theme }: { theme: any }) => theme.cardBackground};
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 0;
`;

const TrackInfo = styled.View`
  flex: 1;
  margin-right: 15px;
  overflow: hidden;
`;


const Controls = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ControlButton = styled(TouchableOpacity)`
  margin-left: 15px;
  background-color: transparent;
`;

interface RandomMusicPlayerProps {
  onRandomize: () => void;
}

const RandomMusicPlayer: React.FC<RandomMusicPlayerProps> = ({ onRandomize }) => {
  const { currentTrack, isPlaying, play, pause } = useAudio();
  const { colors } = useTheme();

  const [isFavorite, setIsFavorite] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const textRef = useRef<Text>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (containerWidth > 0 && textWidth > 0 && textWidth > containerWidth) {
      const scrollDistance = textWidth - containerWidth;
      
      // Reset scroll position before starting a new animation
      scrollX.setValue(0);
      if(scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, animated: false });
      }

      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: scrollDistance + 15, // Add some padding
            duration: (scrollDistance / 10) * 1000, // Adjust speed
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0, // Instant reset
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ])
      );
      
      scrollX.addListener(({ value }) => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: value, animated: false });
        }
      });

      animationRef.current.start();
    } else {
      // If no scroll is needed, stop any running animation
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      // Reset scroll position
      scrollX.setValue(0);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, animated: false });
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      scrollX.removeAllListeners();
    };
  }, [containerWidth, textWidth, currentTrack]);


  // 新增：检查收藏状态
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentTrack) {
        try {
          const favoritesJson = await AsyncStorage.getItem('favoriteTracks');
          const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
          const isCurrentlyFavorite = favorites.some((track: any) => track.id === currentTrack.id);
          setIsFavorite(isCurrentlyFavorite);
        } catch (error) {
          console.error('Failed to load favorites', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [currentTrack]); // 依赖 currentTrack 变化

  // 新增：切换收藏状态
  const toggleFavorite = async () => {
    if (!currentTrack) return;

    try {
      const favoritesJson = await AsyncStorage.getItem('favoriteTracks');
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];

      if (isFavorite) {
        // 从收藏中移除
        favorites = favorites.filter((track: any) => track.id !== currentTrack.id);
        Toast.show({ type: 'info', text1: '音乐已取消收藏' });
      } else {
        // 添加到收藏
        favorites.push(currentTrack);
        Toast.show({ type: 'success', text1: '音乐收藏成功' });
      }

      await AsyncStorage.setItem('favoriteTracks', JSON.stringify(favorites));
      setIsFavorite(!isFavorite); // 更新UI状态
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        play(currentTrack);
      } else {
        onRandomize();
      }
    }
  };

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Container>
          <TrackInfo onLayout={(event: LayoutChangeEvent) => setContainerWidth(event.nativeEvent.layout.width)}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false} // Disable manual scrolling
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <Animated.Text
                ref={textRef}
                onLayout={(event: LayoutChangeEvent) => setTextWidth(event.nativeEvent.layout.width)}
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }}
              >
                {currentTrack ? currentTrack.title : '点击刷新/播放按钮'}
              </Animated.Text>
            </ScrollView>
          </TrackInfo>
          <Controls>
            <ControlButton onPress={handlePlayPause}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={'blue'} />
            </ControlButton>
            {/* 新增收藏按钮 */}
            {currentTrack && ( // 只有当前有音乐时才显示收藏按钮
              <ControlButton onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={'red'} />
              </ControlButton>
            )}
            <ControlButton onPress={onRandomize}>
              <Ionicons name="refresh-outline" size={24} color={'green'} />
            </ControlButton>

          </Controls>
        </Container>
      </Animated.View>
    </Pressable>
  );
};

export default RandomMusicPlayer;
