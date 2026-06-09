import { Image, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from 'src/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

export function FilterEditScreen({ route }: Props) {
  const { imageUri } = route.params;

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text>Editor screen</Text>

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: 300, resizeMode: 'contain' }}
        />
      ) : (
        <Text>No image selected yet.</Text>
      )}
    </View>
  );
}
