
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { weatherIconMapping } from '../data/weatherMapping';
import Toast from 'react-native-toast-message';

// 定义天气数据的形状
export interface WeatherData {
  temp: string;
  high: string;
  low: string;
  condition: string;
  tip: string;
  icon: string;
}

// 定义收藏项的类型
interface FavoriteItem {
  id: string;
  title: string;
}

// 定义用户数据的形状
interface UserData {
  favoriteArticles: FavoriteItem[];
  favoriteMusic: FavoriteItem[];
  history: string[];
  weatherData?: WeatherData;
  musicRefreshCount?: number;
  lastMusicRefreshDate?: string;
}

// 定义Context的形状
interface UserDataContextData extends UserData {
  toggleArticleFavorite: (article: { id: string; title: string }) => void;
  toggleMusicFavorite: (track: { id: string; title: string }) => void;
  isArticleFavorite: (articleId: string) => boolean;
  isMusicFavorite: (trackId: string) => boolean;
  addToHistory: (itemId: string) => void;
  clearFavoriteArticles: () => void;
  clearFavoriteMusic: () => void;
  incrementMusicRefreshCount: () => boolean;
}

// 创建Context
const UserDataContext = createContext<UserDataContextData>({} as UserDataContextData);

// 创建Provider组件
export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    favoriteArticles: [],
    favoriteMusic: [],
    history: [],
    musicRefreshCount: 0,
    lastMusicRefreshDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://node.api.xfabe.com/api/weather/get');
        const json = await response.json();
        if (json.code === 200 && json.data.weather) {
          const weather = json.data.weather[0];
          const condition = weather.temp;
          let iconMapping = weatherIconMapping[condition];

          if (!iconMapping) {
            for (const key in weatherIconMapping) {
              if (condition.includes(key) || key.includes(condition)) {
                iconMapping = weatherIconMapping[key];
                break;
              }
            }
          }
          if (!iconMapping) {
            iconMapping = weatherIconMapping["多云"] || { name: "多云", tip: "天空云量较多，适合户外活动，但需注意防晒或备伞。随身带本好书，在公园长椅上享受阅读时光。", icon: "cloud" };
          }

          const newWeatherData = {
            temp: `${weather.low} ~ ${weather.high}`,
            high: weather.high,
            low: weather.low,
            condition: condition,
            tip: iconMapping.tip,
            icon: iconMapping.icon,
          };
          
          setUserData(prevData => {
            const updatedData = { ...prevData, weatherData: newWeatherData };
            saveData(updatedData); // 保存包括天气在内的所有数据
            return updatedData;
          });

        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        Toast.show({
          type: 'error',
          text1: '天气信息加载失败',
          text2: '请检查网络或稍后再试',
        });
      }
    };

    const loadUserData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          const loadedData = JSON.parse(savedData);
          // 确保收藏字段始终是数组，防止undefined错误
          loadedData.favoriteArticles = loadedData.favoriteArticles || [];
          loadedData.favoriteMusic = loadedData.favoriteMusic || [];
          // 初始化刷新计数
          const today = new Date().toISOString().split('T')[0];
          if (loadedData.lastMusicRefreshDate !== today) {
            loadedData.lastMusicRefreshDate = today;
            loadedData.musicRefreshCount = 0;
          }
          setUserData(loadedData);
        } else {
          // 如果没有保存的数据，确保设置了初始日期
          setUserData(prevData => ({
            ...prevData,
            lastMusicRefreshDate: new Date().toISOString().split('T')[0],
            musicRefreshCount: 0,
          }));
        }
      } catch (error) {
        console.error('从存储加载用户数据失败', error);
      }
    };
    loadUserData();
    fetchWeather();
  }, []);

  const saveData = async (data: UserData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('保存用户数据到存储失败', error);
    }
  };

  const toggleArticleFavorite = (article: { id: string; title: string }) => {
    const { favoriteArticles } = userData;
    const isFavorite = favoriteArticles.some(fav => fav.id === article.id);
    const newFavorites = isFavorite
      ? favoriteArticles.filter(fav => fav.id !== article.id)
      : [...favoriteArticles, { id: article.id, title: article.title }];
    
    const newUserData = { ...userData, favoriteArticles: newFavorites };
    setUserData(newUserData);
    saveData(newUserData);
    Toast.show({
      type: isFavorite ? 'info' : 'success',
      text1: isFavorite ? '文章已取消收藏' : '文章收藏成功',
    });
  };

  const toggleMusicFavorite = (track: { id: string; title: string }) => {
    const { favoriteMusic } = userData;
    const isFavorite = favoriteMusic.some(fav => fav.id === track.id);
    const newFavorites = isFavorite
      ? favoriteMusic.filter(fav => fav.id !== track.id)
      : [...favoriteMusic, { id: track.id, title: track.title }];

    const newUserData = { ...userData, favoriteMusic: newFavorites };
    setUserData(newUserData);
    saveData(newUserData);
    Toast.show({
      type: isFavorite ? 'info' : 'success',
      text1: isFavorite ? '音乐已取消收藏' : '音乐收藏成功',
    });
  };

  const isArticleFavorite = (articleId: string) => {
    return userData.favoriteArticles.some(fav => fav.id === articleId);
  };

  const isMusicFavorite = (trackId: string) => {
    return userData.favoriteMusic.some(fav => fav.id === trackId);
  };

  const clearFavoriteArticles = () => {
    const newUserData = { ...userData, favoriteArticles: [] };
    setUserData(newUserData);
    saveData(newUserData);
    Toast.show({ type: 'success', text1: '已清空文章收藏' });
  };

  const clearFavoriteMusic = () => {
    const newUserData = { ...userData, favoriteMusic: [] };
    setUserData(newUserData);
    saveData(newUserData);
    Toast.show({ type: 'success', text1: '已清空音乐收藏' });
  };

  const addToHistory = (itemId: string) => {
    const { history } = userData;
    // 避免重复并添加到开头
    const newHistory = [itemId, ...history.filter(id => id !== itemId)];
    const newUserData = { ...userData, history: newHistory };
    setUserData(newUserData);
    saveData(newUserData);
  };

  const incrementMusicRefreshCount = () => {
    const today = new Date().toISOString().split('T')[0];
    let currentCount = userData.musicRefreshCount || 0;
    let lastDate = userData.lastMusicRefreshDate;

    // 如果不是今天，重置计数器
    if (lastDate !== today) {
      lastDate = today;
      currentCount = 0;
    }

    if (currentCount >= 10) {
      Toast.show({
        type: 'error',
        text1: '今日音乐达上限',
        text2: '请明天再试',
      });
      return false; // 表示已达上限
    }

    const newCount = currentCount + 1;
    const newUserData = {
      ...userData,
      musicRefreshCount: newCount,
      lastMusicRefreshDate: lastDate,
    };
    setUserData(newUserData);
    saveData(newUserData);
    return true; // 表示刷新成功
  };

  return (
    <UserDataContext.Provider
      value={{
        ...userData,
        toggleArticleFavorite,
        toggleMusicFavorite,
        isArticleFavorite,
        isMusicFavorite,
        addToHistory,
        clearFavoriteArticles,
        clearFavoriteMusic,
        incrementMusicRefreshCount,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// 用于使用UserData Context的自定义Hook
export const useUserData = () => useContext(UserDataContext);
