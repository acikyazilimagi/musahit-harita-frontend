import { create } from "zustand";

interface MapState {
  visitedMarkers: Record<number, number>;
  setVisited: (_id: number) => void;
  isVisited: (_id: number) => boolean;
}

export const useVisitedMarkersStore = create<MapState>()((set, get) => ({
  visitedMarkers: {},
  setVisited: (id: number) => {
    const visitedMarkers = get().visitedMarkers;
    set({ visitedMarkers: { ...visitedMarkers, [id]: id } });
  },
  isVisited: (id: number) => {
    return !!get().visitedMarkers[id];
  },
}));
