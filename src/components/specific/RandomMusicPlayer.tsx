import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, ScrollView, Text, TouchableOpacity, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import { useAudio } from '../../contexts/AudioContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserData } from '../../contexts/UserDataContext';

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
  onRandomize: (callback?: () => void) => void;
}

const RandomMusicPlayer: React.FC<RandomMusicPlayerProps> = ({ onRandomize }) => {
  const { currentTrack, isPlaying, play, pause } = useAudio();
  const { colors } = useTheme();
  const { isMusicFavorite, toggleMusicFavorite } = useUserData();

  const [isLoading, setIsLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const textRef = useRef<Text>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const rotationAnim = useRef(new Animated.Value(0)).current;

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
  }, [containerWidth, textWidth, currentTrack, isLoading]);


  const handleToggleFavorite = () => {
   if (!currentTrack) return;
   toggleMusicFavorite({ id: currentTrack.id, title: currentTrack.title });
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

  const handleRandomizePress = () => {
    setIsLoading(true);
    setIsLoading(true);
    onRandomize(() => {
      setIsLoading(false);
    });
    rotationAnim.setValue(0);
    Animated.timing(rotationAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

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
        <Container style={Platform.OS === 'web' && { width: 340, alignSelf: 'center' }}>
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
                {isLoading ? '加载中...' : (currentTrack ? currentTrack.title : '点击刷新/播放按钮')}
              </Animated.Text>
            </ScrollView>
          </TrackInfo>
          <Controls>
            <ControlButton onPress={handlePlayPause}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={'blue'} />
            </ControlButton>
            {/* 新增收藏按钮 */}
            {currentTrack && ( // 只有当前有音乐时才显示收藏按钮
              <ControlButton onPress={handleToggleFavorite}>
                <Ionicons name={isMusicFavorite(currentTrack.id) ? 'heart' : 'heart-outline'} size={24} color={'red'} />
              </ControlButton>
            )}
            <ControlButton onPress={handleRandomizePress}>
              <Animated.View style={{ transform: [{ rotate: rotationAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
                <Ionicons name="refresh-outline" size={24} color={'green'} />
              </Animated.View>
            </ControlButton>

          </Controls>
        </Container>
      </Animated.View>
    </Pressable>
  );
};

export default RandomMusicPlayer;
