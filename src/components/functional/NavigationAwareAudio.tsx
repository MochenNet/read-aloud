import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useAudio } from '../../contexts/AudioContext';

const NavigationAwareAudio = () => {
  const { stop } = useAudio();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      stop();
    }
  }, [isFocused, stop]);

  return null;
};

export default NavigationAwareAudio;