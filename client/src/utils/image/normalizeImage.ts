import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

type NormalizeImageOptions = {
  maxWidth: number;
  compress?: number;
};

export async function normalizeImage(
  imageUri: string,
  options: NormalizeImageOptions
): Promise<string> {
  const { maxWidth, compress = 1 } = options;

  const imageRef = await ImageManipulator.manipulate(imageUri)
    .resize({ width: maxWidth })
    .renderAsync();

  const result = await imageRef.saveAsync({
    compress,
    format: SaveFormat.JPEG,
  });

  return result.uri;
}
