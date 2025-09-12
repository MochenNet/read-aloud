import React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { AudioProvider } from '../contexts/AudioContext';
import NavigationAwareAudio from '../components/functional/NavigationAwareAudio';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import ReaderScreen from '../screens/HomeStack/ReaderScreen';
import MeScreen from '../screens/MeStack/MeScreen';
import FavoritesScreen from '../screens/MeStack/FavoritesScreen';
import SettingsScreen from '../screens/MeStack/SettingsScreen';
import AboutScreen from '../screens/MeStack/AboutScreen';

import { useTheme, themes } from '../contexts/ThemeContext';

// 定义导航栈的参数
export type HomeStackParamList = {
  Home: undefined;
  Reader: { articleId: string };
};

export type MeStackParamList = {
  Me: undefined;
  Favorites: undefined;
  History: undefined;
  Settings: undefined;
  About: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const MeStack = createStackNavigator<MeStackParamList>();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }} // 在主页隐藏导航栏
    />
    {/* ReaderScreen is now in RootStack */}
  </HomeStack.Navigator>
);

const MeStackScreen = () => {
  const { isDarkMode } = useTheme(); // 获取 isDarkMode
  return (
    <MeStack.Navigator
      screenOptions={{ // 移除箭头函数，直接使用对象
        headerTransparent: true,
        headerTitle: '',
        headerTintColor: isDarkMode ? 'white' : 'black', // 根据深色模式设置颜色
        headerLeftContainerStyle: { paddingLeft: 0 }, // 减小返回按钮的左边距
        headerTitleStyle: { marginLeft: 0 }, // 减小标题的左边距
      }}
    >
      <MeStack.Screen name="Me" component={MeScreen} options={{ headerShown: false }} />
    <MeStack.Screen name="Favorites" component={FavoritesScreen} options={{ headerTitle: '我的收藏' }} />
    <MeStack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: '设置' }} />
    <MeStack.Screen name="About" component={AboutScreen} options={{ headerTitle: '关于我们' }} />
  </MeStack.Navigator>
  );
};

const TabNavigator = () => {
  const { colors, isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        // Define routes where the tab bar should be visible
        const visibleOnRoutes = ['Home', 'Me'];
        const isTabBarVisible = routeName ? visibleOnRoutes.includes(routeName) : true;

        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'MeTab') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Icon name={iconName as string} size={20} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            display: isTabBarVisible ? 'flex' : 'none',
          },
          tabBarBackground: () => {
            const lightColors = ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.7)'] as const;
            const darkColors = ['rgba(50, 50, 50, 0.2)', 'rgba(50, 50, 50, 0.7)'] as const;
            const gradientColors = isDarkMode ? darkColors : lightColors;
            return <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />;
          },
          tabBarLabelStyle: {
            fontFamily: 'TaoBaoMaiCaiTi',
            fontSize: 10,
          },
        };
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: '首页' }} />
      <Tab.Screen name="MeTab" component={MeStackScreen} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Main" component={TabNavigator} />
    <RootStack.Screen
      name="Reader"
      component={ReaderScreen}
      options={{
        headerShown: true,
        headerTransparent: true, // Revert to transparent, will be styled in the component
        headerTitle: '',
      }}
    />
  </RootStack.Navigator>
);

export default () => (
  <NavigationContainer>
    <AudioProvider>
      <AppNavigator />
      <NavigationAwareAudio />
    </AudioProvider>
  </NavigationContainer>
);
