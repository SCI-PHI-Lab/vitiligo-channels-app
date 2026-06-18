import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './RootNavigator';

export function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style='auto' />
    </SafeAreaProvider>
  );
}
