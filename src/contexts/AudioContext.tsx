import React, { createContext, useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Track } from '../types/track';

// 定义Context的形状
interface AudioContextData {
  isPlaying: boolean;
  isBuffering: boolean;
  progress: { position: number; duration: number };
  currentTrack: Track | null;
  play: (track: Track) => void;
  pause: () => void;
  stop: () => void;
  setCurrentTrack: (track: Track) => void;
}

// 创建Context
const AudioContext = createContext<AudioContextData>({} as AudioContextData);

// 创建Provider组件
export const AudioProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState({ position: 0, duration: 0 });
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(null);

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) {
      setIsPlaying(false);
      setIsBuffering(false);
    } else {
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      setProgress({
        position: status.positionMillis / 1000,
        duration: status.durationMillis / 1000,
      });
    }
  };

  const play = async (track: Track) => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.uri === track.url) {
        await sound.playAsync();
        return;
      }
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setCurrentTrackState(track);
    } catch (error) {
      console.error('播放音频时出错', error);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const stop = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setCurrentTrackState(null);
      setProgress({ position: 0, duration: 0 });
    }
  };

  const setCurrentTrack = (track: Track) => {
    setCurrentTrackState(track);
  };

  // 组件卸载时卸载声音
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  
  // 设置音频模式以支持后台播放
  useEffect(() => {
    const setAudioMode = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch (e) {
            console.error('设置音频模式失败', e);
        }
    };
    setAudioMode();
  }, []);


  return (
    <AudioContext.Provider value={{ isPlaying, isBuffering, progress, currentTrack, play, pause, stop, setCurrentTrack }}>
      {children}
    </AudioContext.Provider>
  );
};

// 用于使用Audio Context的自定义Hook
export const useAudio = () => useContext(AudioContext);
