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

import { useTheme, themes } from '../contexts/ThemeContext';

// 定义导航栈的参数
export type HomeStackParamList = {
  Home: undefined;
  Reader: { articleId: string };
};

export type MeStackParamList = {
  Me: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const MeStack = createStackNavigator<MeStackParamList>();
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: themes.light.background, // 默认背景色
      },
      headerTintColor: themes.light.text, // 默认文字颜色
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <HomeStack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ headerShown: false }} // 在主页隐藏导航栏
    />
    <HomeStack.Screen 
      name="Reader" 
      component={ReaderScreen} 
      options={{
        headerTransparent: true,
        headerTitle: '',
        headerBackground: () => (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'transparent']}
            style={{ flex: 1 }}
          />
        ),
        headerStyle: {
          borderBottomWidth: 0, // 确保没有额外的分割线
        },
      }}
    />
  </HomeStack.Navigator>
);

const MeStackScreen = () => (
  <MeStack.Navigator screenOptions={{ headerShown: false }}>
    <MeStack.Screen name="Me" component={MeScreen} />
  </MeStack.Navigator>
);

const AppNavigator = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.light;

    const gradientColors = theme === 'light' 
    ? ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.7)'] 
    : ['rgba(50, 50, 50, 0.15)','rgba(50, 50, 50, 0.7)'];

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
          return <Icon name={iconName as string} size={20} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: currentTheme.text,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          if (routeName === 'Reader') {
            return { display: 'none' };
          }
          return {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            borderTopColor: 'transparent',
          };
        })(route),
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
    <AudioProvider>
      <AppNavigator />
      <NavigationAwareAudio />
    </AudioProvider>
  </NavigationContainer>
);
