import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, View } from 'react-native';

import type { RootStackParamList } from '~/RootNavigator';
import { useImageStore } from '~/utils/image/imageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const setInputImageUri = useImageStore(s => s.setInputImageUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
      allowsMultipleSelection: false,
    });

    if (result.canceled) {
      return;
    }

    const imageUri = result.assets[0]?.uri;

    if (!imageUri) {
      return;
    }

    setInputImageUri(imageUri);
    navigation.navigate('Edit', { imageUri });
  };

  const takeImage = async () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={{ gap: 12, padding: 24 }}>
      <Button title='Upload image' onPress={pickImage} />
      <Button title='Take photo' onPress={takeImage} />
    </View>
  );
}
