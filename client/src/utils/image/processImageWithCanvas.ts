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
  if (width <= 0 || height <= 0 || maxWidth <= 0 || maxHeight <= 0) {
    throw new Error('Image and canvas dimensions must be greater than zero.');
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function assertFiniteNumber(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number.`);
  }
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

  assertFiniteNumber(maxWidth, 'maxWidth');
  assertFiniteNumber(maxHeight, 'maxHeight');
  assertFiniteNumber(jpegQuality, 'jpegQuality');

  if (jpegQuality < 0 || jpegQuality > 1) {
    throw new Error('jpegQuality must be between 0 and 1.');
  }

  const image = new CanvasImage(canvas);
  const imageLoadPromise = waitForCanvasImageLoad(image);
  image.src = imageUri;

  await imageLoadPromise;

  const sourceWidth = Number(image.width);
  const sourceHeight = Number(image.height);

  assertFiniteNumber(sourceWidth, 'sourceWidth');
  assertFiniteNumber(sourceHeight, 'sourceHeight');

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
