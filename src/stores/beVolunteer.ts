import { create } from "zustand";

interface IUseLoading {
  isFormOpen: boolean;
  actions: {
    toggleForm: () => void;
  };
}

export const useBeVolunteerStore = create<IUseLoading>()((set) => ({
  isFormOpen: false,
  actions: {
    toggleForm: () => set((state) => ({ isFormOpen: !state.isFormOpen })),
  },
}));

export const useIsFormOpen = () =>
  useBeVolunteerStore((state) => state.isFormOpen);
export const useBeVolunteerStoreActions = () =>
  useBeVolunteerStore((state) => state.actions);
