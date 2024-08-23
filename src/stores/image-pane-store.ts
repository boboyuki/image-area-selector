import { create } from "zustand";

type ImagePane = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
};

interface IImagePaneState {
  imagePaneMap: Map<string, ImagePane>;
  setImagePaneMap: (id: string, imagePane: ImagePane) => void;
  getImagePane: (id: string) => ImagePane | undefined;
  deleteImagePane: (id: string) => void;
  getImagePanes: () => ImagePane[];
  getImagePanesData: () => Omit<ImagePane, "id">[];
}

export const useImagePaneStore = create<IImagePaneState>((set, get) => ({
  imagePaneMap: new Map<string, ImagePane>(),
  setImagePaneMap: (id, imagePane) => {
    return set((state) => {
      return {
        ...state,
        imagePaneMap: new Map(state.imagePaneMap).set(id, imagePane),
      };
    });
  },
  getImagePane: (id) => get().imagePaneMap.get(id),
  deleteImagePane: (id) =>
    set((state) => {
      const newMap = new Map(state.imagePaneMap);
      newMap.delete(id);
      return {
        ...state,
        imagePaneMap: newMap,
      };
    }),
  getImagePanes: () => Array.from(get().imagePaneMap.values()),
  getImagePanesData: () =>
    Array.from(get().imagePaneMap.values()).map((item) => ({
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    })),
}));
