import React from "react";
import { ScrollView, View,StyleSheet } from "react-native";
import styled from "styled-components/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, themes } from "../../contexts/ThemeContext";
import { HomeStackParamList } from "../../navigation";

type ReaderScreenRouteProp = RouteProp<HomeStackParamList, "Reader">;

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
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin-bottom: 20px;
`;

const Content = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.text};
`;

const ReaderScreen = () => {
  const route = useRoute<ReaderScreenRouteProp>();
  const { theme } = useTheme();
  const { articleId } = route.params;

  const article = {
    title: "示例文章标题",
    content: `这是一个示例文章的内容。文章ID是: ${articleId}\n\n在这里可以显示完整的文章内容，支持滚动阅读。\n\n你可以在这里添加更多的文章内容，比如段落、图片等等。\n\n这个阅读器界面会根据当前的主题（浅色或深色）来调整显示效果。`,
  };

  const renderContent = () => (
    <ContentContainer>
      <Title>{article.title}</Title>
      <Content>{article.content}</Content>
    </ContentContainer>
  );

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
