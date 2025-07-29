
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义用户数据的形状
interface UserData {
  favorites: string[]; // 假设我们存储项目的ID
  history: string[];
}

// 定义Context的形状
interface UserDataContextData extends UserData {
  toggleFavorite: (itemId: string) => void;
  addToHistory: (itemId: string) => void;
}

// 创建Context
const UserDataContext = createContext<UserDataContextData>({} as UserDataContextData);

// 创建Provider组件
export const UserDataProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({ favorites: [], history: [] });

  useEffect(() => {
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
