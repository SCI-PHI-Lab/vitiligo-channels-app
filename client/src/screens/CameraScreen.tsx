import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { SkiaCamera } from 'react-native-vision-camera-skia';

export function CameraScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionRequestStatus, setPermissionRequestStatus] = useState<
    'idle' | 'requesting' | 'settled'
  >('idle');

  useEffect(() => {
    if (hasPermission || permissionRequestStatus !== 'idle') {
      return;
    }

    let isMounted = true;

    setPermissionRequestStatus('requesting');
    void requestPermission().finally(() => {
      if (isMounted) {
        setPermissionRequestStatus('settled');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [hasPermission, permissionRequestStatus, requestPermission]);

  if (!hasPermission) {
    return (
      <Text>
        {permissionRequestStatus === 'settled'
          ? 'Camera permission is required.'
          : 'Requesting camera permission...'}
      </Text>
    );
  }

  if (!device) {
    return <Text>No camera found.</Text>;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <SkiaCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        pixelFormat='yuv'
        onFrame={(frame, render) => {
          'worklet';

          render(({ frameTexture, canvas }) => {
            canvas.drawImage(frameTexture, 0, 0);
          });

          frame.dispose();
        }}
      />
    </View>
  );
}
