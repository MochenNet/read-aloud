import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

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

  const gradientColors = theme === 'light' 
    ? ['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 1)'] 
    : ['rgba(50, 50, 50, 0.85)','rgba(50, 50, 50, 1)'];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MeTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={20} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: currentTheme.text,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={gradientColors}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontFamily: 'TaoBaoMaiCaiTi',
          fontSize: 10,
          
        },
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
