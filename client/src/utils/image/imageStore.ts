import { create } from 'zustand';
import {
  BWVitiligoFilterParams,
  DEFAULT_BW_VITILIGO_FILTER,
} from '~/utils/image/vitiligoFilterModel';

type ImageState = {
  inputImageUri: string | null;
  processedImageUri: string | null;
  selectedFilter: BWVitiligoFilterParams;
  setInputImageUri: (uri: string) => void;
  setProcessedImageUri: (uri: string) => void;
  setSelectedFilter: (filter: BWVitiligoFilterParams) => void;
};

export const useImageStore = create<ImageState>(set => ({
  inputImageUri: null,
  processedImageUri: null,
  selectedFilter: DEFAULT_BW_VITILIGO_FILTER,
  setInputImageUri: uri => set({ inputImageUri: uri }),
  setProcessedImageUri: uri => set({ processedImageUri: uri }),
  setSelectedFilter: filter => set({ selectedFilter: filter }),
}));
