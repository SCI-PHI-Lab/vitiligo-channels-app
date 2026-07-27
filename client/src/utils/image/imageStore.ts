import { create } from 'zustand';
import {
  BWVitiligoFilterParams,
  DEFAULT_BW_VITILIGO_FILTER,
} from '~/types/vitiligoFilterModel';

type ImageState = {
  inputImageUri: string | null;
  processedImageUri: string | null;
  selectedFilter: BWVitiligoFilterParams;
  setInputImageUri: (uri: string) => void;
  setProcessedImageUri: (uri: string) => void;
  setSelectedFilter: (filter: BWVitiligoFilterParams) => void;
};

/** Zustand store for managing the state of the current filter and image being used */
export const useImageStore = create<ImageState>(set => ({
  inputImageUri: null,
  processedImageUri: null,
  selectedFilter: DEFAULT_BW_VITILIGO_FILTER,
  setInputImageUri: uri => set({ inputImageUri: uri }),
  setProcessedImageUri: uri => set({ processedImageUri: uri }),
  setSelectedFilter: filter => set({ selectedFilter: filter }),
}));
