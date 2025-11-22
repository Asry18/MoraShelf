import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  // Load saved theme preference on startup
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('user_theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (e) {
        console.log('Failed to load theme');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem('user_theme', newMode ? 'dark' : 'light');
    } catch (e) {
      console.log('Failed to save theme');
    }
  };

  // Select the active color palette based on state
  const theme = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);