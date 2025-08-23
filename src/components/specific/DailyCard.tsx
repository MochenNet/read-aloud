import React from 'react';
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
  animatedValue: Animated.Value;
}

const DailyCard: React.FC<DailyCardProps> = ({ article, onPlay, onPress, onRandomize, animatedValue }) => {
  const handleButtonPress = () => {
    onPlay();
    onPress();
  };

  const rotateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const animatedStyle = {
    transform: [{ rotateY }],
  };

  const imageSource = article.imageUrl
    ? { uri: article.imageUrl }
    : require('../../assets/images/card-bg.png');

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ImageBackground
        source={imageSource}
        style={styles.imageBackground}
        resizeMode="cover"
        imageStyle={{ borderRadius: 20 }}
      >
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
            <Text style={styles.title}>{article.title}</Text>
            <View style={styles.separator} />
            <Text style={styles.author}>{article.author}</Text>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={handleButtonPress}>
            <Text style={styles.playButtonText}>开始阅读</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 20,
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
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    bottom: 80,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: '15%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 10,
  },
  author: {
    fontSize: 16,
    color: 'white',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: 'center',
    paddingHorizontal: 25,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DailyCard;