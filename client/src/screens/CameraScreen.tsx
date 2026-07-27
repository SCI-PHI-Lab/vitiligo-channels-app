import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { SkiaCamera } from 'react-native-vision-camera-skia';

import type { RootStackParamList } from '~/screens/RootNavigator';
import { useImageStore } from '~/utils/image/imageStore';
import { toFileUri } from '~/utils/image/toFileUri';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export function CameraScreen({ navigation }: Props) {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const photoOutput = usePhotoOutput({
    qualityPrioritization: 'balanced',
    containerFormat: 'jpeg',
  });

  const setInputImageUri = useImageStore(s => s.setInputImageUri);

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestPermission = useCallback(async () => {
    try {
      setIsRequestingPermission(true);
      setErrorMessage(null);

      const granted = await requestPermission();

      if (!granted) {
        setErrorMessage('Camera permission is required.');
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not request camera permission.'
      );
    } finally {
      setIsRequestingPermission(false);
    }
  }, [requestPermission]);

  const handleTakePhoto = async () => {
    if (isTakingPhoto) {
      return;
    }

    try {
      setIsTakingPhoto(true);
      setErrorMessage(null);

      const { filePath } = await photoOutput.capturePhotoToFile(
        { flashMode: 'off' },
        {}
      );

      const imageUri = toFileUri(filePath);
      setInputImageUri(imageUri);

      navigation.navigate('Edit', { imageUri });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not take photo.'
      );
    } finally {
      setIsTakingPhoto(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          Camera access is needed to take photos.
        </Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <View style={styles.permissionButtons}>
          <Button
            title={
              isRequestingPermission ? 'Requesting...' : 'Allow camera access'
            }
            onPress={handleRequestPermission}
            disabled={isRequestingPermission}
          />

          <Button
            title='Open Settings'
            onPress={() => Linking.openSettings()}
          />
        </View>
      </View>
    );
  }

  if (!device) {
    return <Text>No camera found.</Text>;
  }

  return (
    <View style={styles.container}>
      <SkiaCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        outputs={[photoOutput]}
        pixelFormat='native'
        onFrame={(frame, render) => {
          // Worklet directive enables rendering in separate UI thread, improving performance
          'worklet';

          render(({ frameTexture, canvas }) => {
            canvas.drawImage(frameTexture, 0, 0);
          });

          frame.dispose();
        }}
      />

      <View style={styles.bottomControls}>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[
            styles.captureButton,
            isTakingPhoto ? styles.captureButtonDisabled : null,
          ]}
          onPress={handleTakePhoto}
          disabled={isTakingPhoto}
        >
          {isTakingPhoto ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.captureButtonInner} />
          )}
        </TouchableOpacity>

        <Button title='Cancel' onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomControls: {
    alignItems: 'center',
    bottom: 32,
    gap: 16,
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
  },
  captureButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 2,
    height: 60,
    width: 60,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  permissionButtons: {
    gap: 12,
    width: '100%',
  },
});
