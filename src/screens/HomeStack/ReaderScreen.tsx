import React from "react";
import { View, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { articles } from "../../data/articles";
import { useRoute, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation';
import { useHeaderHeight } from '@react-navigation/elements';

// --- Types ---
type ReaderScreenRouteProp = RouteProp<HomeStackParamList, 'Reader'>;

// --- Styled Components ---
const FONT_FAMILY = 'FZJuZXFJW';

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

const ContentContainer = styled.ScrollView<{ paddingTop: number }>`
  flex: 1;
  padding-horizontal: 20px;
  padding-top: ${(props) => props.paddingTop}px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin-bottom: 20px;
  text-align: center;
  font-family: ${FONT_FAMILY};
`;

const Author = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.text};
  font-family: ${FONT_FAMILY};
  text-align: right;
`;

const Paragraph = styled.Text`
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0.5px;
  color: ${(props) => props.theme.text};
  font-family: ${FONT_FAMILY};
  margin-top: 15px;
  text-align: justify;
`;

const Spacer = styled.View`
  height: 120px;
`;

// --- Component ---
const ReaderScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<ReaderScreenRouteProp>();
  const { articleId } = route.params;
  const headerHeight = useHeaderHeight();

  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <Container>
        <Title>文章未找到</Title>
      </Container>
    );
  }

  const articleBody = article.content.substring(article.content.indexOf('\n')).trim();
  const bodyParagraphs = articleBody
    .split(new RegExp('[\r\n]+'))
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(paragraph => `\u3000\u3000${paragraph}`);

  const renderContent = () => (
    <ContentContainer paddingTop={headerHeight + 20}>
      <Title>{article.title}</Title>
      <Author>—— {article.author}</Author>
      {bodyParagraphs.map((p, index) => (
        <Paragraph key={index}>{p}</Paragraph>
      ))}
      <Spacer />
    </ContentContainer>
  );

  if (theme === "light") {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
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
        {renderContent()}
      </View>
    );
  }

  return <Container>{renderContent()}</Container>;
};

export default ReaderScreen;
