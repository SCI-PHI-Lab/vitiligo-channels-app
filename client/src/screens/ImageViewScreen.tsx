import { Image, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '~/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'View'>;

export function ImageViewScreen({ route }: Props) {
  const { processedImageUri } = route.params;

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text>Processed image</Text>

      <Image
        source={{ uri: processedImageUri }}
        style={{ width: '100%', height: 300, resizeMode: 'contain' }}
      />
    </View>
  );
}
