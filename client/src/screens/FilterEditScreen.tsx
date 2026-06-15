import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { VitiligoFilterControls } from '~/components/VilitigoFilterControls';
import { DEFAULT_BW_VITILIGO_FILTER } from '~/utils/image/vitiligoFilterModel';
import { useDebouncedValue } from '~/hooks/useDebouncedValue';

type Props = {
  imageUri: string;
};

export function FilterEditScreen({ imageUri }: Props) {
  const [filterParams, setFilterParams] = useState(DEFAULT_BW_VITILIGO_FILTER);
  const debouncedFilterParams = useDebouncedValue(filterParams, 100);

  // Later:
  // const previewUri = useProcessedPreview(imageUri, debouncedFilterParams);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
      <View>
        <Text>Original</Text>
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: 320, resizeMode: 'contain' }}
        />
      </View>

      <View>
        <Text>Filtered Preview</Text>
        {/* Replace with processed preview URI once native processor is wired */}
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: 320, resizeMode: 'contain' }}
        />
      </View>

      <VitiligoFilterControls value={filterParams} onChange={setFilterParams} />
    </ScrollView>
  );
}
