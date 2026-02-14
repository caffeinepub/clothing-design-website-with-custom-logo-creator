import { create } from 'zustand';
import type { DesignerState, DesignElement, GarmentType } from './designerTypes';

interface DesignerActions {
  setGarmentType: (type: GarmentType) => void;
  setBaseColor: (color: string) => void;
  addElement: (element: DesignElement) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  loadState: (state: Partial<DesignerState>) => void;
}

export const useDesignerState = create<DesignerState & DesignerActions>((set) => ({
  garmentType: 'tshirt',
  baseColor: '#ffffff',
  elements: [],
  selectedElementId: null,

  setGarmentType: (type) => set({ garmentType: type }),
  setBaseColor: (color) => set({ baseColor: color }),

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
      selectedElementId: element.id,
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    })),

  duplicateElement: (id) =>
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      };

      return {
        elements: [...state.elements, newElement],
        selectedElementId: newElement.id,
      };
    }),

  selectElement: (id) => set({ selectedElementId: id }),

  moveElementUp: (id) =>
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      if (index === state.elements.length - 1) return state;

      const newElements = [...state.elements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];

      return { elements: newElements };
    }),

  moveElementDown: (id) =>
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      if (index === 0) return state;

      const newElements = [...state.elements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];

      return { elements: newElements };
    }),

  loadState: (newState) => set((state) => ({ ...state, ...newState })),
}));
