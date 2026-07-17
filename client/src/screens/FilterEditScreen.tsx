import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ViewShot, { captureRef, ViewShotRef } from 'react-native-view-shot';
import type { RootStackParamList } from '~/screens/RootNavigator';
import { VitiligoFilterControls } from '~/components/VitiligoFilterControls';
import {
  DEFAULT_BW_VITILIGO_FILTER,
  type BWVitiligoFilterParams,
  PREVIEW_MAX_SIZE,
} from '~/types/vitiligoFilterModel';
import { normalizeImage } from '~/utils/image/normalizeImage';
import { FilteredImage } from '~/components/FilteredImage';
import { saveImageToCameraRoll, shareImage } from '~/utils/image/exportImage';

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

export function FilterEditScreen({ route }: Props) {
  const { imageUri } = route.params;
  const { width: screenWidth } = useWindowDimensions();

  const previewRef = useRef<ViewShotRef>(null);

  const previewWidth = Math.min(screenWidth - 32, PREVIEW_MAX_SIZE);
  const previewHeight = 420;

  const [filterParams, setFilterParams] = useState<BWVitiligoFilterParams>(
    DEFAULT_BW_VITILIGO_FILTER
  );

  const [skiaImageUri, setSkiaImageUri] = useState<string | null>(null);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function prepareImage() {
      try {
        setIsPreparingImage(true);
        setPrepareError(null);

        const normalizedImage = await normalizeImage(imageUri, {
          maxWidth: PREVIEW_MAX_SIZE,
          compress: 1,
        });

        if (isCurrent) {
          setSkiaImageUri(normalizedImage.uri);
        }
      } catch (error) {
        if (isCurrent) {
          setPrepareError(
            error instanceof Error ? error.message : 'Could not prepare image.'
          );
        }
      } finally {
        if (isCurrent) {
          setIsPreparingImage(false);
        }
      }
    }

    void prepareImage();

    return () => {
      isCurrent = false;
    };
  }, [imageUri]);

  const captureFilteredPreview = async (): Promise<string> => {
    if (!previewRef.current) {
      throw new Error('Filtered preview is not ready yet.');
    }

    return captureRef(previewRef, {
      format: 'jpg',
      quality: 1,
      result: 'tmpfile',
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const capturedUri = await captureFilteredPreview();
      await saveImageToCameraRoll(capturedUri);

      Alert.alert('Saved', 'Filtered image saved to your camera roll.');
    } catch (error) {
      Alert.alert(
        'Save failed',
        error instanceof Error ? error.message : 'Could not save image.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);

      const capturedUri = await captureFilteredPreview();
      await shareImage(capturedUri);
    } catch (error) {
      Alert.alert(
        'Share failed',
        error instanceof Error ? error.message : 'Could not share image.'
      );
    } finally {
      setIsSharing(false);
    }
  };

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

        <ViewShot
          ref={previewRef}
          options={{
            format: 'jpg',
            quality: 1,
            result: 'tmpfile',
          }}
          style={{
            width: previewWidth,
            height: previewHeight,
            backgroundColor: 'black',
          }}
        >
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
                width: previewWidth,
                height: previewHeight,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eee',
              }}
            >
              <ActivityIndicator />
            </View>
          )}
        </ViewShot>

        {isPreparingImage ? <Text>Preparing image...</Text> : null}
        {prepareError ? <Text>{prepareError}</Text> : null}
      </View>

      <VitiligoFilterControls
        filterParams={filterParams}
        setFilterParams={setFilterParams}
      />

      <View style={{ gap: 12 }}>
        <Button
          title={isSaving ? 'Saving...' : 'Save to Camera Roll'}
          onPress={handleSave}
          disabled={!skiaImageUri || isSaving || isSharing}
        />

        <Button
          title={isSharing ? 'Sharing...' : 'Share Image'}
          onPress={handleShare}
          disabled={!skiaImageUri || isSaving || isSharing}
        />
      </View>
    </ScrollView>
  );
}
