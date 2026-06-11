import type { BWVitiligoFilterParams } from './vitiligoFilterModel';

export type RGBImageData = {
  width: number;
  height: number;
  data: Uint8ClampedArray; // RGBA: r,g,b,a,r,g,b,a...
};

function rgbToApproxLightness(r: number, g: number, b: number): number {
  // Approximation of perceptual lightness.
  // For production, replace with actual RGB -> LAB L* conversion.
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function applyBWVitiligoFilter(
  image: RGBImageData,
  params: BWVitiligoFilterParams
): RGBImageData {
  const { width, height, data } = image;

  const output = new Uint8ClampedArray(data.length);

  const rW = params.weights.red / 100;
  const yW = params.weights.yellow / 100;
  const gW = params.weights.green / 100;
  const cW = params.weights.cyan / 100;
  const bW = params.weights.blue / 100;
  const mW = params.weights.magenta / 100;

  const lightnessRatio = params.lightnessRatio;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]!;
    let g = data[i + 1]!;
    let b = data[i + 2]!;
    const a = data[i + 3]!;

    const originalR = r;
    const originalG = g;
    const originalB = b;

    const gray = Math.min(r, g, b);

    r -= gray;
    g -= gray;
    b -= gray;

    let out = 0;

    const isCyanRegion = r === 0;
    const isMagentaRegion = g === 0 && !isCyanRegion;

    if (isCyanRegion) {
      const cyan = Math.min(g, b);
      out = gray + cyan * cW + (g - cyan) * gW + (b - cyan) * bW;
    } else if (isMagentaRegion) {
      const magenta = Math.min(r, b);
      out = gray + magenta * mW + (r - magenta) * rW + (b - magenta) * bW;
    } else {
      const yellow = Math.min(r, g);
      out = gray + yellow * yW + (r - yellow) * rW + (g - yellow) * gW;
    }

    if (lightnessRatio > 0) {
      const lightness = rgbToApproxLightness(originalR, originalG, originalB);
      out = (1 - lightnessRatio) * out + lightnessRatio * lightness;
    }

    const value = Math.max(0, Math.min(255, Math.round(out)));

    output[i] = value;
    output[i + 1] = value;
    output[i + 2] = value;
    output[i + 3] = a;
  }

  return {
    width,
    height,
    data: output,
  };
}
