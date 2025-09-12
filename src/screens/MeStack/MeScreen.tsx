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
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => (Array.isArray(theme.background) ? theme.background[0] : theme.background)};
`;

const Header = styled.View`
  padding: 20px;
  /* padding-top is handled by SafeAreaView */
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
  color: ${({ theme }) => theme.text};
`;

const WeatherCondition = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const WeatherTip = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  line-height: 20px;
`;

const MenuList = styled.View`
  margin-top: 20px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  margin-horizontal: 20px;
  overflow: hidden;
`;

const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.borderColor};
`;

const MenuItemText = styled.Text`
  flex: 1;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-left: 15px;
`;

const CountText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.subtleText};
`;

const FollowUsCard = styled.View`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  margin-horizontal: 20px;
  margin-top: 20px;
  padding: 20px;
  align-items: center;
`;

const FollowUsMainText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-top: 10px;
`;

const FollowUsId = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 5px;
`;

const FollowUsTip = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 5px;
`;

const AbsoluteFill = styled(LinearGradient)`
  ${StyleSheet.absoluteFill}
`;

const MeScreen = () => {
  const { isDarkMode, colors } = useTheme();

  return (
    <Container>
      {!isDarkMode && (
        <>
          <AbsoluteFill
            colors={["rgba(158, 237, 249, 0.7)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0.8 }}
          />
          <AbsoluteFill
            colors={["rgba(185, 243, 190, 0.7)", "transparent"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.2, y: 0.8 }}
          />
        </>
      )}
      <ScrollView style={{ flex: 1 }}>
        <Header>
          <WeatherWidget>
            <FontAwesome5 name="sun" size={30} color={colors.text} />
            <WeatherDetails>
              <WeatherTemp>28°C</WeatherTemp>
              <WeatherCondition>晴朗</WeatherCondition>
            </WeatherDetails>
          </WeatherWidget>
          <WeatherTip>
            天气晴朗，适合出门散步，聆听一首轻快的音乐。
          </WeatherTip>
        </Header>

        <MenuList>
          <MenuItem onPress={() => {}}>
            <Ionicons name="heart-outline" size={24} color={colors.text} />
            <MenuItemText>我的收藏</MenuItemText>
            <CountText>0</CountText>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </MenuItem>
          <MenuItem onPress={() => {}}>
            <Ionicons name="time-outline" size={24} color={colors.text} />
            <MenuItemText>收听历史</MenuItemText>
            <CountText>0</CountText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          <MenuItem onPress={() => {}}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
            <MenuItemText>设置</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          <MenuItem onPress={() => {}} style={{ borderBottomWidth: 0 }}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
            <MenuItemText>关于我们</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
        </MenuList>

        <FollowUsCard>
          <FontAwesome5 name="weixin" size={40} color={colors.wechatColor} />
          <FollowUsMainText>关注我们的公众号</FollowUsMainText>
          <FollowUsId>易悦网络</FollowUsId>
          <FollowUsTip>点击任意位置即可复制</FollowUsTip>
        </FollowUsCard>
      </ScrollView>
    </Container>
  );
};

export default MeScreen;
