import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, themes } from "../../contexts/ThemeContext";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 24px;
`;

const MeScreen = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.light;

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
        <Title>Me Screen</Title>
      </View>
    );
  }

  return (
    <Container style={{ backgroundColor: currentTheme.background }}>
      <Title>Me Screen</Title>
    </Container>
  );
};

export default MeScreen;
