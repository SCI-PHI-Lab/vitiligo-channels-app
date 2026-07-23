import { Asset, requestPermissionsAsync } from 'expo-media-library';
import { isAvailableAsync, shareAsync } from 'expo-sharing';

function toLocalFileUri(pathOrUri: string): string {
  if (pathOrUri.startsWith('file://')) {
    return pathOrUri;
  }

  // ViewShot on iOS commonly returns:
  // /private/var/mobile/.../image.jpg
  if (pathOrUri.startsWith('/')) {
    return `file://${pathOrUri}`;
  }

  return pathOrUri;
}

export async function saveImageToCameraRoll(imageUri: string): Promise<void> {
  const permission = await requestPermissionsAsync(true);

  if (permission.status !== 'granted') {
    throw new Error('Photo library save permission was not granted.');
  }

  const localUri = toLocalFileUri(imageUri);

  await Asset.create(localUri);
}

export async function shareImage(imageUri: string): Promise<void> {
  const isAvailable = await isAvailableAsync();

  if (!isAvailable) {
    throw new Error('Sharing is not available on this device.');
  }

  const localUri = toLocalFileUri(imageUri);

  await shareAsync(localUri, {
    mimeType: 'image/jpeg',
    dialogTitle: 'Share filtered image',
    UTI: 'public.jpeg',
  });
}
