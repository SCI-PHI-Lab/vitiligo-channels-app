import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
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

type PreviewSize = {
  width: number;
  height: number;
};

export function FilterEditScreen({ route }: Props) {
  const { imageUri } = route.params;
  const { width: screenWidth } = useWindowDimensions();

  const previewRef = useRef<ViewShotRef>(null);

  const maxPreviewWidth = Math.min(screenWidth - 32, PREVIEW_MAX_SIZE);
  const maxPreviewHeight = PREVIEW_MAX_SIZE;

  const [filterParams, setFilterParams] = useState<BWVitiligoFilterParams>(
    DEFAULT_BW_VITILIGO_FILTER
  );

  const [skiaImageUri, setSkiaImageUri] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<PreviewSize | null>(null);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isShowingOriginal, setIsShowingOriginal] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function prepareImage() {
      try {
        setIsPreparingImage(true);
        setPrepareError(null);
        setPreviewSize(null);

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

  useEffect(() => {
    if (!skiaImageUri) {
      return;
    }

    let isCurrent = true;

    Image.getSize(
      skiaImageUri,
      (width, height) => {
        if (!isCurrent) {
          return;
        }

        const scale = Math.min(
          maxPreviewWidth / width,
          maxPreviewHeight / height,
          1
        );

        setPreviewSize({
          width: Math.round(width * scale),
          height: Math.round(height * scale),
        });
      },
      () => {
        if (!isCurrent) {
          return;
        }

        setPreviewSize({
          width: maxPreviewWidth,
          height: maxPreviewHeight,
        });
      }
    );

    return () => {
      isCurrent = false;
    };
  }, [skiaImageUri, maxPreviewWidth, maxPreviewHeight]);

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
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.previewSection}>
        <View style={styles.previewHeader}>
          <View>
            <Text style={styles.previewTitle}>Filter applied</Text>
            <Text style={styles.previewSubtitle}>
              Press and hold the image to compare with the original
            </Text>
          </View>
        </View>

        <Pressable
          onPressIn={() => setIsShowingOriginal(true)}
          onPressOut={() => setIsShowingOriginal(false)}
          style={({ pressed }) => [
            styles.previewPressable,
            pressed ? styles.previewPressed : null,
          ]}
        >
          {skiaImageUri && previewSize ? (
            <>
              <ViewShot
                ref={previewRef}
                options={{
                  format: 'jpg',
                  quality: 1,
                  result: 'tmpfile',
                }}
                style={[
                  styles.filteredCaptureLayer,
                  {
                    width: previewSize.width,
                    height: previewSize.height,
                  },
                  isShowingOriginal ? styles.hiddenLayer : null,
                ]}
              >
                <FilteredImage
                  imageUri={skiaImageUri}
                  filter={filterParams}
                  width={previewSize.width}
                  height={previewSize.height}
                />
              </ViewShot>

              {isShowingOriginal ? (
                <Image
                  source={{ uri: skiaImageUri }}
                  style={[
                    styles.originalImage,
                    {
                      width: previewSize.width,
                      height: previewSize.height,
                    },
                  ]}
                />
              ) : null}
            </>
          ) : (
            <View
              style={[
                styles.previewLoading,
                {
                  width: maxPreviewWidth,
                  height: maxPreviewHeight,
                },
              ]}
            >
              <ActivityIndicator />
            </View>
          )}
        </Pressable>

        <View style={styles.previewStatusRow}>
          {isPreparingImage && (
            <Text style={styles.statusText}>Preparing image...</Text>
          )}

          {prepareError ? (
            <Text style={styles.errorText}>{prepareError}</Text>
          ) : null}
        </View>
      </View>

      <VitiligoFilterControls
        filterParams={filterParams}
        setFilterParams={setFilterParams}
      />

      <View style={styles.actions}>
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

const styles = StyleSheet.create({
  actions: {
    gap: 12,
  },
  content: {
    gap: 20,
    padding: 16,
    paddingBottom: 32,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    lineHeight: 18,
  },
  filteredCaptureLayer: {
    backgroundColor: '#ffffff',
    margin: 0,
    padding: 0,
  },
  hiddenLayer: {
    opacity: 0,
    position: 'absolute',
  },
  originalImage: {
    backgroundColor: '#ffffff',
    margin: 0,
    padding: 0,
  },
  previewHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  previewLoading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPressable: {
    alignItems: 'center',
    alignSelf: 'center',
    margin: 0,
    padding: 0,
  },
  previewPressed: {
    opacity: 1,
  },
  previewSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    paddingTop: 14,
    paddingBottom: 0,
  },
  previewStatusRow: {
    gap: 4,
    width: '100%',
  },
  previewSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  previewTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '700',
  },
  statusText: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
});
