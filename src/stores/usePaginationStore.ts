import { create } from 'zustand';

interface PaginationState {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  animalLength: number;
  setAnimalLength: (length: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  currentPage: 0,
  animalLength: 0,
  setAnimalLength: (length: number) => set({ animalLength: length }), 
  setCurrentPage: (page: number) => set({ currentPage: page }),
}));