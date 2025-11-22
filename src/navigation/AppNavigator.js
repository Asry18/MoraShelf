import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux'; 

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import BookDetailsScreen from '../screens/home/BookDetailsScreen';
import { loadUser } from '../store/slices/authSlice';
import { loadFavorites } from '../store/slices/favoritesSlice';
import { useTheme } from '../theme/ThemeContext'; // Import Hook

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  // Get Theme Data
  const { theme, isDark } = useTheme();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadFavorites());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Define Navigation Theme for React Navigation internals
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="BookDetails" 
              component={BookDetailsScreen} 
              options={{ 
                headerShown: true, 
                title: 'Details',
                // DYNAMIC HEADER STYLES
                headerStyle: { backgroundColor: theme.primary },
                headerTintColor: isDark ? '#000' : '#FFF' // Gold needs black text, Maroon needs white
              }} 
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}