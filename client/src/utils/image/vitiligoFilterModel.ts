export type BWVitiligoWeights = {
  red: number;
  yellow: number;
  green: number;
  cyan: number;
  blue: number;
  magenta: number;
};

export type BWVitiligoFilterParams = {
  weights: BWVitiligoWeights;
  lightnessRatio: number; // 0 to 1
};

export const DEFAULT_BW_VITILIGO_FILTER: BWVitiligoFilterParams = {
  weights: {
    red: 40,
    yellow: -200,
    green: 40,
    cyan: 60,
    blue: 20,
    magenta: 80,
  },
  lightnessRatio: 0.2,
};

export type FilterProcessingMode = 'preview' | 'export';

export const PREVIEW_MAX_SIZE = 1024;
export const EXPORT_MAX_SIZE = 4096;
