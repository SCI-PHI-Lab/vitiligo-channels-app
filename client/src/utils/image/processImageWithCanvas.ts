import Canvas, { Image as CanvasImage, ImageData } from 'react-native-canvas';

import { applyBWVitiligoFilter } from './bwFilterUtils';
import type { BWVitiligoFilterParams } from './vitiligoFilterModel';

type ProcessImageOptions = {
  maxWidth?: number;
  maxHeight?: number;
  jpegQuality?: number;
};

function waitForCanvasImageLoad(image: CanvasImage): Promise<void> {
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => resolve());
    image.addEventListener('error', () =>
      reject(new Error('Failed to load image.'))
    );
  });
}

function getScaledSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

export async function processImageWithCanvas(
  canvas: Canvas,
  imageUri: string,
  params: BWVitiligoFilterParams,
  options: ProcessImageOptions = {}
): Promise<string> {
  const maxWidth = options.maxWidth ?? 900;
  const maxHeight = options.maxHeight ?? 900;
  const jpegQuality = options.jpegQuality ?? 0.95;

  const image = new CanvasImage(canvas);
  image.src = imageUri;

  await waitForCanvasImageLoad(image);

  const sourceWidth = Number(image.width);
  const sourceHeight = Number(image.height);

  const scaled = getScaledSize(sourceWidth, sourceHeight, maxWidth, maxHeight);

  canvas.width = scaled.width;
  canvas.height = scaled.height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context.');
  }

  ctx.drawImage(image, 0, 0, scaled.width, scaled.height);

  const rawImageData = await ctx.getImageData(
    0,
    0,
    scaled.width,
    scaled.height
  );

  const filtered = applyBWVitiligoFilter(
    {
      width: scaled.width,
      height: scaled.height,
      data: new Uint8ClampedArray(rawImageData.data),
    },
    params
  );

  const outputImageData = new ImageData(
    canvas,
    [...filtered.data],
    filtered.width,
    filtered.height
  );

  ctx.putImageData(outputImageData, 0, 0);

  return canvas.toDataURL('image/jpeg', jpegQuality);
}
