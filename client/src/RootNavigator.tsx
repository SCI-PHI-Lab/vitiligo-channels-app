import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '~/screens/HomeScreen';
import { CameraScreen } from '~/screens/CameraScreen';
import { FilterEditScreen } from '~/screens/FilterEditScreen';
import { ImageViewScreen } from '~/screens/ImageViewScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Edit: {
    imageUri: string;
  };
  View: {
    originalImageUri: string;
    processedImageUri: string;
  };
};

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Navigator
        initialRouteName='Home'
        screenOptions={{ headerTitleAlign: 'center' }}
      >
        <Screen
          name='Home'
          component={HomeScreen}
          options={{ title: 'Vitiligo Filter App' }}
        />
        <Screen
          name='Camera'
          component={CameraScreen}
          options={{ title: 'Camera' }}
        />
        <Screen
          name='Edit'
          component={FilterEditScreen}
          options={{ title: 'Filter Editor' }}
        />
        <Screen
          name='View'
          component={ImageViewScreen}
          options={{ title: 'Processed Image' }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
