import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'; // 
import { store } from './src/store/store'; //
import { ThemeProvider } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // WRAP EVERYTHING IN PROVIDER
    <Provider store={store}> 
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}