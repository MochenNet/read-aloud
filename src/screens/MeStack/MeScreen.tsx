import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";
import { Linking } from "react-native";
import styled from "styled-components/native";
import Toast from 'react-native-toast-message'; // 导入 Toast
import * as Clipboard from 'expo-clipboard'; // 导入 Clipboard
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, AppTheme } from "../../contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MeStackParamList } from '../../navigation';
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Styled Components
const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => (Array.isArray(theme.background) ? theme.background[0] : theme.background)};
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
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const WeatherCondition = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
`;

const WeatherTip = styled.Text`
  font-size: 14px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  line-height: 20px;
`;

const MenuList = styled.View`
  margin-top: 20px;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.cardBackground};
  border-radius: 10px;
  margin-horizontal: 20px;
  overflow: hidden;
`;

const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: AppTheme }) => theme.borderColor};
`;

const MenuItemText = styled.Text`
  flex: 1;
  font-size: 18px;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  margin-left: 15px;
`;

const CountText = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
`;

const FollowUsCard = styled(TouchableOpacity)`
  background-color: ${({ theme }: { theme: AppTheme }) => theme.cardBackground};
  border-radius: 10px;
  margin-horizontal: 20px;
  padding: 20px;
  align-items: center;
`;

const FollowUsMainText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }: { theme: AppTheme }) => theme.text};
  margin-top: 10px;
`;

const FollowUsId = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
  margin-top: 5px;
`;

const FollowUsTip = styled.Text`
  font-size: 12px;
  color: ${({ theme }: { theme: AppTheme }) => theme.subtleText};
  margin-top: 5px;
`;

const AbsoluteFill = styled(LinearGradient)`
  ${StyleSheet.absoluteFill}
`;

const MeScreen = () => {
  const { isDarkMode, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<MeStackParamList>>();

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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top }}
      >
        <Header style={{ paddingLeft: 28 }}>
          <WeatherWidget>
            <FontAwesome5 name="sun" size={30} color={colors.text} />
            <WeatherDetails>
              <WeatherTemp>{'28°C'}</WeatherTemp>
              <WeatherCondition>{'晴朗'}</WeatherCondition>
            </WeatherDetails>
          </WeatherWidget>
          <WeatherTip>
            {'天气晴朗，适合出门散步，聆听一首轻快的音乐。'}
          </WeatherTip>
        </Header>

        <FollowUsCard onPress={async () => {
          const idToCopy = '易悦网络'; // 获取要复制的文本
          await Clipboard.setStringAsync(idToCopy);
          Toast.show({
            type: 'success',
            text1: '已复制到剪贴板',
            text2: idToCopy,
          });
        }}>
          <FontAwesome5 name="weixin" size={40} color={colors.wechatColor} />
          <FollowUsMainText>{'关注我们的公众号'}</FollowUsMainText>
          <FollowUsId>{'易悦网络'}</FollowUsId>
          <FollowUsTip>{'点击此处可复制'}</FollowUsTip>
        </FollowUsCard>

        <MenuList>
          <MenuItem onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart-outline" size={24} color={colors.text} />
            <MenuItemText>{'我的收藏'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </MenuItem>
          
          <MenuItem onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
            <MenuItemText>{'设置'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate('About')} style={{ borderBottomWidth: 0 }}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
            <MenuItemText>{'关于我们'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          <MenuItem onPress={() => Linking.openURL('https://www.123pan.com/s/csSaTd-6Yxw3.html')}>
            <Ionicons name="apps-outline" size={24} color={colors.text} />
            <MenuItemText>{'更多应用'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
        </MenuList>

        
      </ScrollView>
    </Container>
  );
};

export default MeScreen;
