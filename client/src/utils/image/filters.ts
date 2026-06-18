export type FilterPreset = {
  id: string;
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
};

export const DEFAULT_FILTER: FilterPreset = {
  id: 'natural',
  name: 'Natural',
  brightness: 0,
  contrast: 1,
  saturation: 1,
  temperature: 0,
};

export type FilterProcessingMode = 'preview' | 'export';

export const PREVIEW_MAX_SIZE = 600;
export const EXPORT_MAX_SIZE = 4096;
