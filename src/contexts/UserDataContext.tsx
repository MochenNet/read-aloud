
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

// 定义用户数据的形状
interface UserData {
  favorites: string[]; // 假设我们存储项目的ID
  history: string[];
  weatherData?: WeatherData;
}

// 定义Context的形状
interface UserDataContextData extends UserData {
  toggleFavorite: (itemId: string) => void;
  addToHistory: (itemId: string) => void;
}

// 创建Context
const UserDataContext = createContext<UserDataContextData>({} as UserDataContextData);

// 创建Provider组件
export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({ favorites: [], history: [] });

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
          setUserData(JSON.parse(savedData));
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

  const toggleFavorite = (itemId: string) => {
    const { favorites } = userData;
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    const newUserData = { ...userData, favorites: newFavorites };
    setUserData(newUserData);
    saveData(newUserData);
  };

  const addToHistory = (itemId: string) => {
    const { history } = userData;
    // 避免重复并添加到开头
    const newHistory = [itemId, ...history.filter(id => id !== itemId)];
    const newUserData = { ...userData, history: newHistory };
    setUserData(newUserData);
    saveData(newUserData);
  };

  return (
    <UserDataContext.Provider value={{ ...userData, toggleFavorite, addToHistory }}>
      {children}
    </UserDataContext.Provider>
  );
};

// 用于使用UserData Context的自定义Hook
export const useUserData = () => useContext(UserDataContext);
