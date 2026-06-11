import { StyleSheet, View, Text } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { SkiaCamera } from 'react-native-vision-camera-skia';

export function CameraScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  if (!hasPermission) {
    void requestPermission();
    return <Text>Requesting camera permission...</Text>;
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
          render(({ frameTexture, canvas }) => {
            canvas.drawImage(frameTexture, 0, 0);
            // Add Skia filter/drawing here.
          });

          frame.dispose();
        }}
      />
    </View>
  );
}
