import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

export async function normalizeImage(
  imageUri: string,
  maxWidth: number
): Promise<string> {
  const result = await manipulateAsync(
    imageUri,
    [
      {
        resize: {
          width: maxWidth,
        },
      },
    ],
    {
      compress: 1,
      format: SaveFormat.JPEG,
      base64: false,
    }
  );

  return result.uri;
}
