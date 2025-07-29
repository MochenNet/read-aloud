
import React, { createContext, useContext, useEffect, useState } from 'react';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability, Event, State, usePlaybackState, useProgress } from 'react-native-track-player';

// 定义Context的形状
interface AudioContextData {
  isPlaying: boolean;
  isBuffering: boolean;
  progress: { position: number; duration: number };
  play: (track: any) => void;
  pause: () => void;
  // ... 其他音频控制方法
}

// 创建Context
const AudioContext = createContext<AudioContextData>({} as AudioContextData);

// 设置播放器
const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
    });
  } catch (error) {
    console.error('设置播放器时出错', error);
  }
};

// 创建Provider组件
export const AudioProvider: React.FC = ({ children }) => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isPlayerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await setupPlayer();
      setPlayerReady(true);
    };
    init();
  }, []);

  const play = async (track: any) => {
    if (!isPlayerReady) return;
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const isPlaying = playbackState.state === State.Playing;
  const isBuffering = playbackState.state === State.Buffering;

  return (
    <AudioContext.Provider value={{ isPlaying, isBuffering, progress, play, pause }}>
      {children}
    </AudioContext.Provider>
  );
};

// 用于使用Audio Context的自定义Hook
export const useAudio = () => useContext(AudioContext);
