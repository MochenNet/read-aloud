
import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../../contexts/ThemeContext';

// 定义组件的Props
interface DailyCardProps {
  imageUrl: string;
  title: string;
  text: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPlay: () => void;
  onPress?: () => void;
}

const CardContainer = styled.TouchableOpacity`
  height: 500px; /* 示例高度 */
  border-radius: 20px;
  overflow: hidden;
  margin: 20px;
  justify-content: flex-end; /* 将内容推到底部 */
`;

const BackgroundImage = styled(ImageBackground)`
  flex: 1;
  justify-content: flex-end;
`;

const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.4);
  padding: 20px;
`;

const Title = styled.Text`
  color: #FFFFFF;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ContentText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  margin-bottom: 16px;
`;

const ControlsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PlayButton = styled.TouchableOpacity`
  /* 播放按钮样式 */
`;

const FavoriteButton = styled.TouchableOpacity`
  /* 收藏按钮样式 */
`;

const DailyCard: React.FC<DailyCardProps> = ({
  imageUrl,
  title,
  text,
  isFavorite,
  onToggleFavorite,
  onPlay,
  onPress
}) => {
  const { theme } = useTheme();

  return (
    <CardContainer onPress={onPress}>
      <BackgroundImage source={{ uri: imageUrl }}>
        <Overlay>
          <Title>{title}</Title>
          <ContentText>{text}</ContentText>
          <ControlsContainer>
            <PlayButton onPress={onPlay}>
              <Icon name="play-circle" size={48} color="#FFFFFF" />
            </PlayButton>
            <FavoriteButton onPress={onToggleFavorite}>
              <Icon name={'heart'} solid={isFavorite} size={24} color="#FFFFFF" />
            </FavoriteButton>
          </ControlsContainer>
        </Overlay>
      </BackgroundImage>
    </CardContainer>
  );
};

export default DailyCard;
