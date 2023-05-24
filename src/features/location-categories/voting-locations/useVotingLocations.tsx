import omit from "lodash.omit";
import { create } from "zustand";
import { getHashStorage } from "@/utils/zustand";
import { persist } from "zustand/middleware";
import type { City, District, Neighborhood } from "@/data/models";

interface State {
  isOpen: boolean;
  selectedCity: City | null;
  selectedDistrict: District | null;
  selectedNeighborhood: Neighborhood | null;
  actions: {
    setSelectedNeighborhood: (
      _selectedNeighborhood: Neighborhood | null
    ) => void;
    setIsOpen: (_isOpen: boolean) => void;
    setSelectedCity: (_selectedCity: City | null) => void;
    setSelectedDistrict: (_selectedDistrict: District | null) => void;
  };
}

export const useVotingLocations = create<State>()(
  persist(
    (set) => ({
      isOpen: false,
      selectedCity: null,
      selectedDistrict: null,
      selectedNeighborhood: null,
      actions: {
        setSelectedCity: (selectedCity) => set(() => ({ selectedCity })),
        setSelectedDistrict: (selectedDistrict) =>
          set(() => ({ selectedDistrict })),
        setSelectedNeighborhood: (selectedNeighborhood) =>
          set(() => ({ selectedNeighborhood })),
        setIsOpen: (isOpen) => set(() => ({ isOpen })),
      },
    }),
    {
      name: "voting-locations",
      getStorage: () => getHashStorage(),
      partialize: (state) => ({ ...omit(state, "actions") }),
    }
  )
);

useVotingLocations.subscribe(({ actions, ...state }, prevState) => {
  if (state.selectedCity?.id !== prevState.selectedCity?.id) {
    actions.setSelectedDistrict(null);
    actions.setSelectedNeighborhood(null);
    return;
  }

  if (state.selectedDistrict?.id !== prevState.selectedDistrict?.id) {
    actions.setSelectedNeighborhood(null);
    return;
  }
});
