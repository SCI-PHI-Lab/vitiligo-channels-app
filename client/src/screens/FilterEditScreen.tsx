import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '~/RootNavigator';
import { VitiligoFilterControls } from '~/components/VitiligoFilterControls';

import {
  DEFAULT_BW_VITILIGO_FILTER,
  type BWVitiligoFilterParams,
  PREVIEW_MAX_SIZE,
} from '~/utils/image/vitiligoFilterModel';
import { normalizeImage } from '~/utils/image/normalizeImage';
import { FilteredImage } from '~/components/FilteredImage';

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

export function FilterEditScreen({ route }: Props) {
  const { imageUri } = route.params;
  const { width: screenWidth } = useWindowDimensions();

  const previewWidth = Math.min(screenWidth - 32, PREVIEW_MAX_SIZE);
  const previewHeight = 420;

  const [filterParams, setFilterParams] = useState<BWVitiligoFilterParams>(
    DEFAULT_BW_VITILIGO_FILTER
  );

  const [skiaImageUri, setSkiaImageUri] = useState<string | null>(null);
  const [prepareError, setPrepareError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function prepareImage() {
      try {
        setPrepareError(null);

        const normalizedUri = await normalizeImage(imageUri, PREVIEW_MAX_SIZE);

        if (isCurrent) {
          setSkiaImageUri(normalizedUri);
        }
      } catch (error) {
        if (isCurrent) {
          setPrepareError(
            error instanceof Error ? error.message : 'Could not prepare image.'
          );
        }
      }
    }

    void prepareImage();

    return () => {
      isCurrent = false;
    };
  }, [imageUri]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
      <View>
        <Text>Original</Text>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: '100%',
            height: 320,
            resizeMode: 'contain',
            backgroundColor: '#eee',
          }}
        />
      </View>

      <View>
        <Text>Filtered Preview</Text>

        {skiaImageUri ? (
          <FilteredImage
            imageUri={skiaImageUri}
            filter={filterParams}
            width={previewWidth}
            height={previewHeight}
          />
        ) : (
          <View
            style={{
              height: previewHeight,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#eee',
            }}
          >
            <ActivityIndicator />
          </View>
        )}

        {prepareError ? <Text>{prepareError}</Text> : null}
      </View>

      <VitiligoFilterControls value={filterParams} onChange={setFilterParams} />
    </ScrollView>
  );
}
