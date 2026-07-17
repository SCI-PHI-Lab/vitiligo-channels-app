import { Asset, requestPermissionsAsync } from 'expo-media-library';
import { isAvailableAsync, shareAsync } from 'expo-sharing';

type SaveImageResult = {
  assetId: string;
  uri: string;
};

export async function requestMediaLibrarySavePermission(): Promise<void> {
  const permission = await requestPermissionsAsync(true);

  if (permission.status !== 'granted') {
    throw new Error('Photo library permission was not granted.');
  }
}

export async function saveImageToCameraRoll(
  imageUri: string
): Promise<SaveImageResult> {
  await requestMediaLibrarySavePermission();

  const asset = await Asset.create(imageUri);

  return {
    assetId: asset.id,
    uri: await asset.getUri(),
  };
}

export async function shareImage(imageUri: string): Promise<void> {
  const isAvailable = await isAvailableAsync();

  if (!isAvailable) {
    throw new Error('Sharing is not available on this device.');
  }

  await shareAsync(imageUri, {
    mimeType: 'image/jpeg',
    dialogTitle: 'Share filtered image',
    UTI: 'public.jpeg',
  });
}
