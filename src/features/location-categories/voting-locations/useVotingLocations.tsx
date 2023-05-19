import omit from "lodash.omit";
import { create } from "zustand";
import { getHashStorage } from "@/utils/zustand";
import { persist } from "zustand/middleware";
import cities from "@/data/tr-cities.json";
import cityDistricts from "@/data/tr-city-districts.json";

export type City = (typeof cities)[number];
export type District = (typeof cityDistricts)[number];

interface State {
  isOpen: boolean;
  selectedCityId: number | null;
  selectedCity: City | null;
  selectedDistrictId: number | null;
  selectedDistrict: District | null;
  selectedNeighborhoodId: number | null;
  selectedSchoolId: number | null;
  actions: {
    setSelectedCityId: (_selectedCityId: number | null) => void;
    setSelectedDistrictId: (_selectedDistrictId: number | null) => void;
    setSelectedNeighborhoodId: (_selectedNeighborhoodId: number | null) => void;
    setSelectedSchoolId: (_selectedSchoolId: number | null) => void;
    setIsOpen: (_isOpen: boolean) => void;
    setSelectedCity: (_selectedCity: City | null) => void;
    setSelectedDistrict: (_selectedDistrict: District | null) => void;
  };
}

export const useVotingLocations = create<State>()(
  persist(
    (set) => ({
      isOpen: false,
      selectedCityId: null,
      selectedCity: null,
      selectedDistrictId: null,
      selectedDistrict: null,
      selectedNeighborhoodId: null,
      selectedSchoolId: null,
      actions: {
        setSelectedCityId: (selectedCityId) => set(() => ({ selectedCityId })),
        setSelectedDistrictId: (selectedDistrictId) =>
          set(() => ({ selectedDistrictId })),
        setSelectedNeighborhoodId: (selectedNeighborhoodId) =>
          set(() => ({ selectedNeighborhoodId })),
        setSelectedSchoolId: (selectedSchoolId) =>
          set(() => ({ selectedSchoolId })),
        setIsOpen: (isOpen) => set(() => ({ isOpen })),
        setSelectedCity: (selectedCity) => set(() => ({ selectedCity })),
        setSelectedDistrict: (selectedDistrict) =>
          set(() => ({ selectedDistrict })),
      },
    }),
    {
      name: "voting-locations",
      getStorage: () => getHashStorage(),
      partialize: (state) => ({ ...omit(state, "actions") }),
    }
  )
);

useVotingLocations.subscribe((state, previousState) => {
  if (state.selectedCityId === previousState.selectedCityId) return;

  const city = cities.find((city) => city.id === state.selectedCityId);

  if (!city || city.id == previousState.selectedCityId) return;

  state.actions.setSelectedCity(city);

  state.actions.setSelectedDistrictId(null);
  state.actions.setSelectedNeighborhoodId(null);
  state.actions.setSelectedSchoolId(null);
});

useVotingLocations.subscribe((state, previousState) => {
  if (!state.selectedCity?.id) return;

  if (state.selectedDistrictId == previousState.selectedDistrictId) return;

  const district = cityDistricts.find(
    (district) => district.id == state.selectedDistrictId
  );

  if (!district || district.id == previousState.selectedDistrictId) return;

  state.actions.setSelectedDistrict(district);

  state.actions.setSelectedNeighborhoodId(null);
  state.actions.setSelectedSchoolId(null);
});
