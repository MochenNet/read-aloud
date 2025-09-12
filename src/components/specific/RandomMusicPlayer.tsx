import React from 'react';
import { TouchableOpacity } from 'react-native';
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
`;

const TrackTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }: { theme: any }) => theme.text};
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
      <TrackInfo>
        <TrackTitle numberOfLines={1}>
          {currentTrack ? currentTrack.title : '点击播放音乐'}
        </TrackTitle>
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
