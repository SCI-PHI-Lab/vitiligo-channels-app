import { useEffect, useRef, useState } from 'react';
import Canvas from 'react-native-canvas';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '~/RootNavigator';
import { VitiligoFilterControls } from '~/components/VitiligoFilterControls';
import { useDebouncedValue } from '~/hooks/useDebouncedValue';
import { PREVIEW_MAX_SIZE } from '~/utils/image/filters';
import { processImageWithCanvas } from '~/utils/image/processImageWithCanvas';
import { DEFAULT_BW_VITILIGO_FILTER } from '~/utils/image/vitiligoFilterModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

export function FilterEditScreen({ route }: Props) {
  const { imageUri } = route.params;
  const [filterParams, setFilterParams] = useState(DEFAULT_BW_VITILIGO_FILTER);
  const [processingCanvas, setProcessingCanvas] = useState<Canvas | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isProcessingPreview, setIsProcessingPreview] = useState(false);
  const debouncedFilterParams = useDebouncedValue(filterParams, 100);
  const previewRequestId = useRef(0);
  const processingQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (!processingCanvas) {
      return;
    }

    let isCurrent = true;
    const requestId = previewRequestId.current + 1;
    previewRequestId.current = requestId;

    setIsProcessingPreview(true);
    setPreviewError(null);

    const processPreview = async () => {
      await processingQueue.current;

      if (!isCurrent || previewRequestId.current !== requestId) {
        return;
      }

      const nextPreviewUri = await processImageWithCanvas(
        processingCanvas,
        imageUri,
        debouncedFilterParams,
        {
          maxWidth: PREVIEW_MAX_SIZE,
          maxHeight: PREVIEW_MAX_SIZE,
          jpegQuality: 0.9,
        }
      );

      if (isCurrent && previewRequestId.current === requestId) {
        setPreviewUri(nextPreviewUri);
      }
    };

    const previewTask = processPreview()
      .catch(error => {
        if (isCurrent && previewRequestId.current === requestId) {
          setPreviewError(
            error instanceof Error
              ? error.message
              : 'Could not render filtered preview.'
          );
        }
      })
      .finally(() => {
        if (isCurrent && previewRequestId.current === requestId) {
          setIsProcessingPreview(false);
        }
      });

    processingQueue.current = previewTask.then(
      () => undefined,
      () => undefined
    );

    return () => {
      isCurrent = false;
    };
  }, [debouncedFilterParams, imageUri, processingCanvas]);

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
        <Image
          source={{ uri: previewUri ?? imageUri }}
          style={{ width: '100%', height: 320, resizeMode: 'contain' }}
        />
        {isProcessingPreview ? <ActivityIndicator /> : null}
        {previewError ? <Text>{previewError}</Text> : null}
      </View>

      <VitiligoFilterControls value={filterParams} onChange={setFilterParams} />
      <Canvas ref={setProcessingCanvas} style={styles.processingCanvas} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  processingCanvas: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
});
