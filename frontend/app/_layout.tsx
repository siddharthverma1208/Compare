import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="ride-comparison" 
          options={{ 
            headerShown: true,
            title: 'Ride Comparison',
            headerStyle: { backgroundColor: '#0066CC' },
            headerTintColor: '#fff'
          }} 
        />
        <Stack.Screen 
          name="grocery-comparison" 
          options={{ 
            headerShown: true,
            title: 'Grocery Comparison',
            headerStyle: { backgroundColor: '#00CC66' },
            headerTintColor: '#fff'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}