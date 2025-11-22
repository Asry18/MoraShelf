import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// IMPORT REDUX HOOKS
import { useSelector, useDispatch } from 'react-redux'; 

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import BookDetailsScreen from '../screens/home/BookDetailsScreen';
import { colors } from '../theme/colors';
// IMPORT ACTIONS
import { loadUser } from '../store/slices/authSlice';
import { loadFavorites } from '../store/slices/favoritesSlice';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // --- NEW REDUX LOGIC STARTS HERE ---
  const dispatch = useDispatch();
  // Read 'user' and 'isLoading' from the auth slice
  const { user, isLoading } = useSelector((state) => state.auth);

  // Load saved data when app starts
  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadFavorites());
  }, [dispatch]);

  // Show spinner while checking storage
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  // --- NEW REDUX LOGIC ENDS HERE ---

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? ( // Check real user state
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="BookDetails" 
              component={BookDetailsScreen} 
              options={{ 
                headerShown: true, 
                title: 'Details',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white
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