import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../contexts/AudioContext';
import { useTheme } from '../../contexts/ThemeContext';

interface RandomMusicPlayerProps {
  onRandomize: () => void;
}

const RandomMusicPlayer: React.FC<RandomMusicPlayerProps> = ({ onRandomize }) => {
  const { currentTrack, isPlaying, play, pause } = useAudio();
  const { currentTheme } = useTheme();

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
    <View style={[styles.container, {     backgroundColor: 'rgba(255, 255, 255, 0.33)', }]}>
      <View style={styles.trackInfo}>
        <Text style={[styles.trackTitle, { color: currentTheme.text }]} numberOfLines={1}>
          {currentTrack ? currentTrack.title : '暂无音乐'}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity activeOpacity={1} underlayColor="transparent" onPress={handlePlayPause} style={styles.controlButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} underlayColor="transparent" onPress={onRandomize} style={styles.controlButton}>
          <Ionicons name="refresh-outline" size={24} color={currentTheme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: Platform.OS === 'android' ? 0 : 5,
  },
  trackInfo: {
    flex: 1,
    marginRight: 15,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    marginLeft: 15,
    backgroundColor: 'transparent',
  },
});

export default RandomMusicPlayer;
