
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../../types/article';

interface DailyCardProps {
  article: Article;
  onPlay: () => void;
  onPress: () => void;
}

const DailyCard: React.FC<DailyCardProps> = ({ article, onPlay, onPress }) => {
  const handleButtonPress = () => {
    onPlay();
    onPress();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/card-bg.png')} // 使用本地图片
        style={styles.imageBackground}
        resizeMode="contain"
      >
        <View style={styles.overlay}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>每日推荐</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{article.title}</Text>
            <View style={styles.separator} />
            <Text style={styles.author}>{article.author}</Text>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={handleButtonPress}>
            {/* <Ionicons name="play" size={20} color="white" style={{ marginLeft: 4 }} /> */}
            <Text style={styles.playButtonText}>开始阅读</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
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
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    alignItems: 'center',
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
    marginLeft: 8,
  },
});

export default DailyCard;
