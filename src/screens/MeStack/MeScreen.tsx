import React, { useState, useRef } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  View,
  Animated,
  Pressable,
  Easing,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import { Linking } from "react-native";
import styled from "styled-components/native";
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, AppTheme } from "../../contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MeStackParamList } from '../../navigation';
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUserData } from "../../contexts/UserDataContext";

// Styled Components
const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }: { theme: AppTheme }) => (Array.isArray(theme.background) ? theme.background[0] : theme.background)};
`;

const Header = styled.View`
  padding: 20px;
`;

const WeatherWidget = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const WeatherDetails = styled.View`
  margin-left: 20px;
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

const FollowUsCardView = styled(View)`
  background-color: ${({ theme }: { theme: AppTheme }) => theme.cardBackground};
  border-radius: 10px;
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

const getStyles = (colors: AppTheme) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: '85%',
    backgroundColor: Array.isArray(colors.background) ? colors.background[1] : colors.background,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.text,
  },
  modalText: {
    width: 260,
    marginBottom: 15,
    textAlign: "center",
    color: colors.subtleText,
    lineHeight: 22,
  },
  input: {
    width: 260,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    borderColor: colors.borderColor,
  },
  errorText: {
    color: 'red',
    height: 20,
    marginBottom: 5,
    textAlign: 'center',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 260
  },
  buttonClose: {
    marginTop: 10,
    backgroundColor: colors.wechatColor,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

const MeScreen = () => {
  const { isDarkMode, colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<MeStackParamList>>();
  const { weatherData, userData, setUserData, saveData } = useUserData();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleActivate = () => {
    if (activationCode.trim() === '') {
      setErrorText('请输入激活码');
      return;
    }
    if (activationCode === 'YDsZkTbTd6Sf') {
      setErrorText('');
      const newUserData = { ...userData, isVip: true };
      setUserData(newUserData);
      saveData(newUserData);
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: '激活成功',
        text2: '您已获得无限阅读权限',
      });
    } else {
      setErrorText('激活码不正确');
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: 'success',
      text1: '已复制到剪贴板',
    });
  };

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };


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
            <FontAwesome5 name={weatherData?.icon ?? 'question-circle'} size={30} color={colors.text} />
            <WeatherDetails>
              <WeatherTemp>{weatherData?.temp ?? 'N/A'}</WeatherTemp>
              <WeatherCondition>{weatherData?.condition ?? '未知'}</WeatherCondition>
            </WeatherDetails>
          </WeatherWidget>
          <WeatherTip>
            {weatherData?.tip ?? '正在加载天气信息...'}
          </WeatherTip>
        </Header>

        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={async () => {
            const idToCopy = '易悦网络'; // 获取要复制的文本
            await Clipboard.setStringAsync(idToCopy);
            Toast.show({
              type: 'success',
              text1: '已复制到剪贴板',
              text2: idToCopy,
            });
          }}
          style={{ marginHorizontal: 20 }}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <FollowUsCardView>
              <FontAwesome5 name="weixin" size={40} color={colors.wechatColor} />
              <FollowUsMainText>{'关注我们的公众号'}</FollowUsMainText>
              <FollowUsId>{'易悦网络'}</FollowUsId>
              <FollowUsTip>{'点击可复制'}</FollowUsTip>
            </FollowUsCardView>
          </Animated.View>
        </Pressable>

        <MenuList>
          <MenuItem onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart-outline" size={24} color={colors.text} />
            <MenuItemText>{'我的收藏'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </MenuItem>
          
          <MenuItem onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
            <MenuItemText>{'应用设置'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          <MenuItem onPress={() => {
            if (userData.isVip) {
              Toast.show({
                type: 'info',
                text1: '您已永久激活',
              });
            } else {
              setModalVisible(true)
            }
          }}>
            <Ionicons name="ribbon-outline" size={24} color={colors.text} />
            <MenuItemText>
              {userData.isVip ? '无限阅读' : '提升上限'}
            </MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          <MenuItem onPress={() => Linking.openURL('https://www.123pan.com/s/csSaTd-6Yxw3.html')}>
            <Ionicons name="apps-outline" size={24} color={colors.text} />
            <MenuItemText>{'更多推荐'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          
          <MenuItem onPress={() => navigation.navigate('About')} style={{ borderBottomWidth: 0 }}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
            <MenuItemText>{'关于我们'}</MenuItemText>
            <Ionicons name="chevron-forward" size={20} color={colors.subtleText} />
          </MenuItem>
          
        </MenuList>

        
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>永久无限阅读</Text>
              <Pressable onLongPress={() => copyToClipboard('阅读兑换码')}>
                <Text style={styles.modalText}>
                  {"\n"}限制阅读次数原因：服务器压力太大，没有资金升级，如果您需要不受限制，可以通过兑换码自行升级。{"\n"}
                  关注公众号<Text style={{color: '#bc941cc8', fontWeight: 'bold'}}>（易悦网络）</Text>后，回复<Text style={{color: colors.primaryColor, fontWeight: 'bold'}}>“阅读激活码”</Text>免费获取激活码。
                  
                  {"\n"}(长按可复制关键词)
                </Text>
              </Pressable>
              
              <Text style={styles.errorText}>{errorText}</Text>
              <TextInput
                style={styles.input}
                placeholder="在此输入激活码"
                placeholderTextColor={colors.subtleText}
                value={activationCode}
                onChangeText={(text) => {
                  setActivationCode(text);
                  if (errorText) {
                    setErrorText("");
                  }
                }}
              />
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primaryColor }]}
                onPress={handleActivate}
              >
                <Text style={styles.textStyle}>兑换</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>关闭</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>

    </Container>
  );
};

export default MeScreen;
