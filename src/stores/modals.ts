import { create } from "zustand";

interface IModalStore {
  kvkk: boolean;
  actions: {
    toggleKVKK: () => void;
  };
}

export const useModalStore = create<IModalStore>()((set) => ({
  kvkk: false,
  actions: {
    toggleKVKK: () => set((state) => ({ kvkk: !state.kvkk })),
  },
}));

export const useKvkkModalOpen = () => useModalStore((state) => state.kvkk);
export const useModalStoreActions = () =>
  useModalStore((state) => state.actions);
