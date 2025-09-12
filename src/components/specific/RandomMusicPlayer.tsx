import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
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

  return (
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
            {currentTrack ? currentTrack.title : '点击播放音乐'}
          </Animated.Text>
        </ScrollView>
      </TrackInfo>
      <Controls>
        <ControlButton onPress={handlePlayPause}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={colors.text} />
        </ControlButton>
        <ControlButton onPress={onRandomize}>
          <Ionicons name="refresh-outline" size={24} color={colors.text} />
        </ControlButton>
      </Controls>
    </Container>
  );
};

export default RandomMusicPlayer;
