import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { articles } from "../../data/articles";

// 定义要使用的字体名称 (需要和 App.tsx 中加载的键一致)
const FONT_FAMILY = 'FZJuZXFJW';

const FullScreenLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin-bottom: 20;
  text-align: center;
  font-family: ${FONT_FAMILY};
`;

const ParagraphBase = styled.Text`
  font-size: 18;
  line-height: 30;
  letter-spacing: 0.5;
  color: ${(props) => props.theme.text};
  font-family: ${FONT_FAMILY};
  margin-top: 15;
  text-align: justify;
`;

const FirstParagraph = styled(ParagraphBase)`
  text-align: right;
  margin-top: 0;
  font-size: 16;
`;

const Content = styled(ParagraphBase)``;

// 用于在内容底部创建额外空间的占位符
const Spacer = styled.View`
  height: 85px;
`;

const ReaderScreen = () => {
  const { theme } = useTheme();

  // 随机选择一篇文章
  const randomIndex = Math.floor(Math.random() * articles.length);
  const article = articles[randomIndex];

  // 从文章内容中提取正文 (跳过第一行)
  const articleBody = article.content.substring(article.content.indexOf('\n')).trim();

  // 将正文分割成段落，并添加首行缩进
  const bodyParagraphs = articleBody
    .split(new RegExp('[\r\n]+'))
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(paragraph => `\u3000\u3000${paragraph}`);

  // 渲染文章内容的函数
  const renderContent = () => (
    <ContentContainer>
      <Title>{article.title}</Title>
      <FirstParagraph>—— {article.author}</FirstParagraph>
      {bodyParagraphs.map((p, index) => (
        <Content key={index}>{p}</Content>
      ))}
      <Spacer />
    </ContentContainer>
  );

  // 根据主题选择不同的背景
  if (theme === "light") {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <FullScreenLinearGradient
          colors={["rgba(224, 247, 250, 0.7)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        <FullScreenLinearGradient
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