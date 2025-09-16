import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, AppTheme } from "../../contexts/ThemeContext";
import { useUserData } from "../../contexts/UserDataContext";
import { articles } from "../../data/articles";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation';
import { useHeaderHeight } from '@react-navigation/elements';

// --- Types ---
type ReaderScreenRouteProp = RouteProp<HomeStackParamList, 'Reader'>;

// --- Styled Components ---
const FONT_FAMILY = 'FZJuZXFJW';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => (Array.isArray(theme.background) ? theme.background[0] : theme.background)};
`;

const ContentContainer = styled.ScrollView<{ paddingTop: number }>`
  flex: 1;
  padding-horizontal: 20px;
  padding-top: ${(props: { paddingTop: number }) => props.paddingTop}px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  margin-bottom: 20px;
  text-align: center;
  font-family: ${FONT_FAMILY};
`;

const Author = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  font-family: ${FONT_FAMILY};
  text-align: right;
`;

const Paragraph = styled.Text<{ fontSize: number }>`
  font-size: ${({ fontSize }: { fontSize: number }) => fontSize}px;
  line-height: ${({ fontSize }: { fontSize: number }) => fontSize * 1.7}px;
  letter-spacing: 0.5px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  font-family: ${FONT_FAMILY};
  margin-top: 15px;
  text-align: justify;
`;

const Spacer = styled.View`
  height: 120px;
`;

// --- Component ---
const ReaderScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const { userData } = useUserData();
  const navigation = useNavigation();
  const route = useRoute<ReaderScreenRouteProp>();
  const { articleId } = route.params;
  const headerHeight = useHeaderHeight();

  const getFontSize = () => {
    switch (userData.fontSize) {
      case 'small':
        return 16;
      case 'large':
        return 20;
      case 'standard':
      default:
        return 18;
    }
  };
  const paragraphFontSize = getFontSize();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: 'white', // Set a fixed color for visibility on transparent bg
    });
  }, [navigation]);

  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <Container>
        <Title>文章未找到</Title>
      </Container>
    );
  }

  const articleBody = article.content?.substring(article.content.indexOf('\n')).trim() ?? '';
  const bodyParagraphs = articleBody
    .split(new RegExp('[\r\n]+'))
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(paragraph => `\u3000\u3000${paragraph}`);

  const renderContent = () => (
    <ContentContainer paddingTop={headerHeight}>
      <Title>{article.title}</Title>
      <Author>—— {article.author}</Author>
      {bodyParagraphs.map((p, index) => (
        <Paragraph key={index} fontSize={paragraphFontSize}>{p}</Paragraph>
      ))}
      <Spacer />
    </ContentContainer>
  );

  return (
    <Container>
      {!isDarkMode && (
        <>
          <LinearGradient
            colors={["rgba(224, 247, 250, 0.7)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0.8 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["rgba(232, 245, 233, 0.7)", "transparent"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.2, y: 0.8 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      )}
      {renderContent()}
    </Container>
  );
};

export default ReaderScreen;
