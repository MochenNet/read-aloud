import React, { createContext, useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';

// 定义Context的形状
interface AudioContextData {
  isPlaying: boolean;
  isBuffering: boolean;
  progress: { position: number; duration: number };
  play: (track: { url: string }) => void;
  pause: () => void;
}

// 创建Context
const AudioContext = createContext<AudioContextData>({} as AudioContextData);

// 创建Provider组件
export const AudioProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState({ position: 0, duration: 0 });

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

  const play = async (track: { url: string }) => {
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('播放音频时出错', error);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
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
    <AudioContext.Provider value={{ isPlaying, isBuffering, progress, play, pause }}>
      {children}
    </AudioContext.Provider>
  );
};

// 用于使用Audio Context的自定义Hook
export const useAudio = () => useContext(AudioContext);