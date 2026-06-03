import * as ImagePicker from 'expo-image-picker';
import { Button, View } from 'react-native';
import { useImageStore } from '~/utils/image/imageStore';

export function HomeScreen() {
  const setInputImageUri = useImageStore(s => s.setInputImageUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setInputImageUri(result.assets[0]!.uri);
    }
  };

  const takeImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setInputImageUri(result.assets[0]!.uri);
    }
  };

  return (
    <View style={{ gap: 12, padding: 24 }}>
      <Button title='Upload image' onPress={pickImage} />
      <Button title='Take photo' onPress={takeImage} />
    </View>
  );
}
