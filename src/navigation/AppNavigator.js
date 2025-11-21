import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import BookDetailsScreen from '../screens/home/BookDetailsScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // MOCK STATE: Change this to true to see the Home screen
  const isLoggedIn = false; 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          // User is Logged In
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
          // User is NOT Logged In
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}