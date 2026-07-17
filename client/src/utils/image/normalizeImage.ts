import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

type NormalizeImageOptions = {
  maxWidth: number;
  compress?: number;
};

type NormalizeImageOutput = {
  uri: string;
  width: number;
  height: number;
};

/**
 * Normalizes an image to the specified size, optionally compressing it
 *
 * @param {string} imageUri - The URI of the image to normalize
 * @param {NormalizeImageOptions} options - Parameters used in normalization
 *
 * @return Object containing the newly generated URI and metadata for the normalized image
 */
export async function normalizeImage(
  imageUri: string,
  options: NormalizeImageOptions
): Promise<NormalizeImageOutput> {
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
