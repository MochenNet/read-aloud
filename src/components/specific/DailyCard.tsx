import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../../types/article';

interface DailyCardProps {
  article: Article;
  onPlay: () => void;
  onPress: () => void;
  onRandomize: () => void;
}

const getImageSource = (imageUrl?: string) => {
  return imageUrl ? { uri: imageUrl } : require('../../assets/images/card-bg.png');
};

interface MarqueeTextProps {
  text: string;
  style?: any;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ text, style }) => {
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const onTextLayout = (event: any) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  const onContainerLayout = (event: any) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (textWidth > containerWidth) {
      scrollAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: -(textWidth - containerWidth + 10), // 10 for some padding
            duration: (textWidth - containerWidth) * 15, // Adjust speed as needed
            useNativeDriver: true,
          }),
          Animated.delay(1000), // Add a delay before looping back
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: (textWidth - containerWidth) * 15, // Adjust speed as needed
            useNativeDriver: true,
          }),
          Animated.delay(1000), // Add a delay before starting again
        ]),
      ).start();
    } else {
      scrollAnim.stopAnimation();
      scrollAnim.setValue(0);
    }
  }, [textWidth, containerWidth, text]);

  return (
    <View style={{ overflow: 'hidden', flexDirection: 'row' }} onLayout={onContainerLayout}>
      <Animated.Text
        style={[{ transform: [{ translateX: scrollAnim }] }, style]}
        onLayout={onTextLayout}
        numberOfLines={1}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const DailyCard: React.FC<DailyCardProps> = ({ article, onPlay, onPress, onRandomize }) => {
  const [currentArticle, setCurrentArticle] = useState(article);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageFadeIn = useRef(new Animated.Value(0)).current;

  const isInitializing = article.id === 'initial-placeholder';

  useEffect(() => {
    if (article.id !== currentArticle.id) {
      setIsLoading(true);
      setNextArticle(article);
    }
  }, [article, currentArticle.id]);

  const onNextImageLoad = () => {
    Animated.timing(imageFadeIn, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setCurrentArticle(article);
      setNextArticle(null);
      imageFadeIn.setValue(0);
      setIsLoading(false);
    });
  };

  const onNextImageError = () => {
    setError('图片加载失败，使用默认背景');
    setCurrentArticle({ ...article, imageUrl: undefined });
    setNextArticle(null);
    setIsLoading(false);
  };

  return (
    <View style={{width: '100%'}}>
      <View style={styles.container}>
        <ImageBackground
          source={getImageSource(currentArticle.imageUrl)}
          style={styles.imageBackground}
          resizeMode="cover"
          imageStyle={{ borderRadius: 20 }}
          onLoadEnd={() => console.log('ImageBackground loaded successfully')}
          onError={(error) => console.log('ImageBackground failed to load:', error.nativeEvent.error)}
        >
          {nextArticle && (
            <Animated.Image
              source={getImageSource(nextArticle.imageUrl)}
              onLoad={onNextImageLoad}
              onError={onNextImageError}
              style={[styles.imageOverlay, { opacity: imageFadeIn, borderRadius: 20 }]}
              resizeMode="cover"
            />
          )}
          <View style={styles.overlay}>
            <View style={styles.topContainer}>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>每日推荐</Text>
              </View>
              <TouchableOpacity style={styles.randomizeButton} onPress={onRandomize}>
                <Ionicons name="refresh-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
              {isLoading || isInitializing ? (
                <Text style={styles.title}>加载中...</Text>
              ) : (
                <>
                  <MarqueeText text={currentArticle.title} style={styles.title} />
                  <View style={styles.separator} />
                  <Text style={styles.author}>{currentArticle.author}</Text>
                </>
              )}
            </View>

            {!(isLoading || isInitializing) && (
              <TouchableOpacity 
                style={styles.playButton} 
                onPress={() => {
                  onPlay();
                  onPress();
                }}
              >
                <Text style={styles.playButtonText}>开始阅读</Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height:  Platform.OS === 'android' ? '82%' : 400,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: Platform.OS === 'android' ? 0 : 15,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  randomizeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    marginVertical: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left', // Changed to left for marquee effect
  },
  separator: {
    height: 1,
    width: '15%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 10,
  },
  author: {
    fontSize: 22,
    color: 'white',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: 'center',
    paddingHorizontal: 25,
  },
  playButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default DailyCard;