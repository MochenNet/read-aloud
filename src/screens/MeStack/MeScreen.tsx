import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, themes } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

const Header = styled.View`
  padding: 20px;
  padding-top: ${Platform.OS === "android" ? "40px" : "20px"};
  background-color: ${(props) => props.theme.background};
`;

const WeatherWidget = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const WeatherDetails = styled.View`
  margin-left: 10px;
`;

const WeatherTemp = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
`;

const WeatherCondition = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;

const WeatherTip = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.text};
  line-height: 20px;
`;

const MenuList = styled.View`
  margin-top: 20px;
  background-color: ${(props) => props.theme.cardBackground};
  border-radius: 10px;
  margin-horizontal: 20px;
  overflow: hidden;
`;

const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderColor};
`;

const MenuItemText = styled.Text`
  flex: 1;
  font-size: 18px;
  color: ${(props) => props.theme.text};
  margin-left: 15px;
`;

const CountText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.subtleText};
`;

const FollowUsCard = styled.View`
  background-color: ${(props) => props.theme.cardBackground};
  border-radius: 10px;
  margin-horizontal: 20px;
  margin-top: 20px;
  padding: 20px;
  align-items: center;
`;

const FollowUsMainText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${(props: { theme: { text: string } }) => props.theme.text};
  margin-top: 10px;
`;

const FollowUsId = styled.Text`
  font-size: 16px;
  color: ${(props: { theme: { subtleText: string } }) => props.theme.subtleText};
  margin-top: 5px;
`;

const FollowUsTip = styled.Text`
  font-size: 12px;
  color: ${(props: { theme: { subtleText: string } }) => props.theme.subtleText};
  margin-top: 5px;
`;

const MeScreen = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.light;

  return (
    <Container style={{ backgroundColor: currentTheme.background }}>
      {theme === "light" && (
        <>
          <LinearGradient
            colors={["rgba(158, 237, 249, 0.7)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0.8 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["rgba(185, 243, 190, 0.7)", "transparent"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.2, y: 0.8 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      )}
      <ScrollView style={{ flex: 1 }}>
        <Header theme={currentTheme}>
          <WeatherWidget>
            <FontAwesome5 name="sun" size={30} color={currentTheme.text} />
            <WeatherDetails>
              <WeatherTemp theme={currentTheme}>28°C</WeatherTemp>
              <WeatherCondition theme={currentTheme}>晴朗</WeatherCondition>
            </WeatherDetails>
          </WeatherWidget>
          <WeatherTip theme={currentTheme}>
            天气晴朗，适合出门散步，聆听一首轻快的音乐。
          </WeatherTip>
        </Header>

        <MenuList theme={currentTheme}>
          <MenuItem theme={currentTheme} onPress={() => {}}>
            <Ionicons name="heart-outline" size={24} color={currentTheme.text} />
            <MenuItemText theme={currentTheme}>我的收藏</MenuItemText>
            <CountText theme={currentTheme}>0</CountText>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.text} />
          </MenuItem>
          <MenuItem theme={currentTheme} onPress={() => {}}>
            <Ionicons name="time-outline" size={24} color={currentTheme.text} />
            <MenuItemText theme={currentTheme}>收听历史</MenuItemText>
            <CountText theme={currentTheme}>0</CountText>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.subtleText} />
          </MenuItem>
          <MenuItem theme={currentTheme} onPress={() => {}}>
            <Ionicons name="settings-outline" size={24} color={currentTheme.text} />
            <MenuItemText theme={currentTheme}>设置</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.subtleText} />
          </MenuItem>
          <MenuItem theme={currentTheme} onPress={() => {}} style={{ borderBottomWidth: 0 }}>
            <Ionicons name="information-circle-outline" size={24} color={currentTheme.text} />
            <MenuItemText theme={currentTheme}>关于我们</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.subtleText} />
          </MenuItem>
        </MenuList>

        <FollowUsCard theme={currentTheme}>
          <FontAwesome5 name="weixin" size={40} color="#28C445" />
          <FollowUsMainText theme={currentTheme}>关注我们的公众号</FollowUsMainText>
          <FollowUsId theme={currentTheme}>易悦网络</FollowUsId>
          <FollowUsTip theme={currentTheme}>点击任意位置即可复制</FollowUsTip>
        </FollowUsCard>
      </ScrollView>
    </Container>
  );
};

export default MeScreen;
