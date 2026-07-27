export type BWVitiligoFilterParams = {
  redWeight: number;
  yellowWeight: number;
  greenWeight: number;
  cyanWeight: number;
  blueWeight: number;
  magentaWeight: number;
  lightnessRatio: number; // float in [0, 1]
};

/** Initial shader uniforms used by the vitiligo filter */
export const DEFAULT_BW_VITILIGO_FILTER: BWVitiligoFilterParams = {
  redWeight: 40,
  yellowWeight: -200,
  greenWeight: 40,
  cyanWeight: 60,
  blueWeight: 20,
  magentaWeight: 80,
  lightnessRatio: 0.2,
};

export type FilterProcessingMode = 'preview' | 'export';

export const PREVIEW_MAX_SIZE = 1024;
export const EXPORT_MAX_SIZE = 4096;
