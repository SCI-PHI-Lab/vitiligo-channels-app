import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '~/screens/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Editor: {
    imageUri: string;
  };
  Result: {
    originalImageUri: string;
    processedImageUri: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ title: 'Vitiligo Filter App' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
