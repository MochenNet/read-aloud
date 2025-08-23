
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeStack/HomeScreen';
import ReaderScreen from '../screens/HomeStack/ReaderScreen';
import MeScreen from '../screens/MeStack/MeScreen';

import { useTheme, themes } from '../contexts/ThemeContext';

// 定义导航栈的参数
export type HomeStackParamList = {
  Home: undefined;
  Reader: { articleId: string };
};

export type MeStackParamList = {
  Me: undefined;
  // ... 其他“我的”页面栈
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const MeStack = createStackNavigator<MeStackParamList>();
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Reader" component={ReaderScreen} />
  </HomeStack.Navigator>
);

const MeStackScreen = () => (
  <MeStack.Navigator screenOptions={{ headerShown: false }}>
    <MeStack.Screen name="Me" component={MeScreen} />
    {/* 其他“我的”页面栈的屏幕会在这里添加 */}
  </MeStack.Navigator>
);

const AppNavigator = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home'; // 这里可以用不同的图标来表示选中状态
          } else if (route.name === 'MeTab') {
            iconName = focused ? 'user-alt' : 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentTheme.text, // 示例颜色
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: currentTheme.card,
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: '首页' }} />
      <Tab.Screen name="MeTab" component={MeStackScreen} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
};

export default () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);
