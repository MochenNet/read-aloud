import React from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import DailyCard from '../../components/specific/DailyCard';
import { useUserData } from '../../contexts/UserDataContext';
import { useAudio } from '../../contexts/AudioContext';
import { HomeStackParamList } from '../../navigation';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

// Styled Components
const ThemedContainer = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const MainContent = styled(SafeAreaView)`
  flex: 1;
  padding-top: ${Platform.OS === 'android' ? '25px' : '0'};
`;

const Header = styled.View`
  padding: 10px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AppName = styled.Text`
  font-size: 28px;
  color: ${props => props.theme.text};
  font-family: 'TaoBaoMaiCaiTi'; /* 使用自定义字体 */
`;

const DateDisplay = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const Day = styled.Text`
  font-size: 30px;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const Month = styled.Text`
  font-size: 16px;
  font-weight: 300;
  margin-left: 5px;
  margin-bottom: 5px; /* Aligns with the bottom of the day number */
  color: ${props => props.theme.text};
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: flex-start; /* Align card to the top */
  align-items: center;
  padding: 20px; /* Add top padding */
`;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, currentTheme } = useTheme();
  const { favorites, toggleFavorite } = useUserData();
  const { play } = useAudio();

  // 获取当前日期
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('zh-CN', { month: 'long' });

  // 临时的假数据
  const dummyArticle = {
    id: '1',
    title: '关于告别',
    text: '我们一生都在学着如何告别，却总是学不会。',
    imageUrl: 'https://placehold.co/600x400/a2d2ff/333333?text=阅声', // 示例图片
    audioUrl: 'https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3' // 后面需要一个真实的音频URL
  };

  const isFavorite = favorites.includes(dummyArticle.id);

  const handlePlay = () => {
    play({
      id: dummyArticle.id,
      url: dummyArticle.audioUrl,
      title: dummyArticle.title,
      artist: '阅·声'
    });
  };

  const handleCardPress = () => {
    navigation.navigate('Reader', { articleId: dummyArticle.id });
  };

  const renderContent = () => (
    <MainContent>
      <Header>
        <AppName theme={currentTheme}>阅·声</AppName>
        <DateDisplay>
          <Day theme={currentTheme}>{day}</Day>
          <Month theme={currentTheme}>/ {month}</Month>
        </DateDisplay>
      </Header>
      <CardContainer>
        <DailyCard
          imageUrl={dummyArticle.imageUrl}
          title={dummyArticle.title}
          text={dummyArticle.text}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(dummyArticle.id)}
          onPlay={handlePlay}
          onPress={handleCardPress}
        />
      </CardContainer>
    </MainContent>
  );

  if (theme === 'light') {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LinearGradient
          colors={['rgba(224, 247, 250, 0.7)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(232, 245, 233, 0.7)', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        {renderContent()}
      </View>
    );
  }

  return (
    <ThemedContainer theme={currentTheme}>
      {renderContent()}
    </ThemedContainer>
  );
};

export default HomeScreen;