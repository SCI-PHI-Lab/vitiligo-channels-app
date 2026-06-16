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

export const FILTERS: FilterPreset[] = [
  DEFAULT_FILTER,
  {
    id: 'contrast-enhance',
    name: 'Contrast Enhance',
    brightness: 0.02,
    contrast: 1.25,
    saturation: 0.95,
    temperature: 0,
  },
  {
    id: 'depigmentation-detail',
    name: 'Depigmentation Detail',
    brightness: 0.05,
    contrast: 1.4,
    saturation: 0.65,
    temperature: -0.05,
  },
  {
    id: 'edge-visibility',
    name: 'Edge Visibility',
    brightness: 0,
    contrast: 1.6,
    saturation: 0.5,
    temperature: 0,
  },
];

export type FilterProcessingMode = 'preview' | 'export';

export const PREVIEW_MAX_SIZE = 600;
export const EXPORT_MAX_SIZE = 4096;
