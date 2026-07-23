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
  const [isShowingOriginal, setIsShowingOriginal] = useState(false);

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
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.previewSection}>
        <View style={styles.previewHeader}>
          <View>
            <Text style={styles.previewTitle}>
              {isShowingOriginal ? 'Original Image' : 'Filtered Preview'}
            </Text>
            <Text style={styles.previewSubtitle}>
              Press and hold the image to compare with the original.
            </Text>
          </View>

          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>
              {isShowingOriginal ? 'Original' : 'Filtered'}
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
          <View style={styles.previewFrame}>
            {skiaImageUri ? (
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
                      width: previewWidth,
                      height: previewHeight,
                    },
                    isShowingOriginal ? styles.hiddenLayer : null,
                  ]}
                >
                  <FilteredImage
                    imageUri={skiaImageUri}
                    filter={filterParams}
                    width={previewWidth}
                    height={previewHeight}
                  />
                </ViewShot>

                {isShowingOriginal ? (
                  <Image
                    source={{ uri: skiaImageUri }}
                    style={[
                      styles.originalImage,
                      {
                        width: previewWidth,
                        height: previewHeight,
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
                    width: previewWidth,
                    height: previewHeight,
                  },
                ]}
              >
                <ActivityIndicator />
              </View>
            )}
          </View>
        </Pressable>

        <View style={styles.previewStatusRow}>
          {isPreparingImage ? (
            <Text style={styles.statusText}>Preparing image...</Text>
          ) : (
            <Text style={styles.statusText}>
              {skiaImageUri ? 'Filtered image ready.' : 'Loading image...'}
            </Text>
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
    backgroundColor: '#000000',
  },
  hiddenLayer: {
    opacity: 0,
    position: 'absolute',
  },
  originalImage: {
    backgroundColor: '#000000',
    resizeMode: 'contain',
  },
  previewBadge: {
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  previewBadgeText: {
    color: '#3730a3',
    fontSize: 12,
    fontWeight: '700',
  },
  previewFrame: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 18,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  previewLoading: {
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
  },
  previewPressable: {
    alignItems: 'center',
  },
  previewPressed: {
    opacity: 0.96,
  },
  previewSection: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
    padding: 14,
  },
  previewStatusRow: {
    gap: 4,
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
