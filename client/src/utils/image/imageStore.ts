import { create } from 'zustand';
import type { FilterPreset } from './filters';
import { DEFAULT_FILTER } from './filters';

type ImageState = {
  inputImageUri: string | null;
  processedImageUri: string | null;
  selectedFilter: FilterPreset;
  setInputImageUri: (uri: string) => void;
  setProcessedImageUri: (uri: string) => void;
  setSelectedFilter: (filter: FilterPreset) => void;
};

export const useImageStore = create<ImageState>(set => ({
  inputImageUri: null,
  processedImageUri: null,
  selectedFilter: DEFAULT_FILTER,
  setInputImageUri: uri => set({ inputImageUri: uri }),
  setProcessedImageUri: uri => set({ processedImageUri: uri }),
  setSelectedFilter: filter => set({ selectedFilter: filter }),
}));
