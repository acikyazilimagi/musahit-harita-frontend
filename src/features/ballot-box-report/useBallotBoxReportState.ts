import { create } from "zustand";

interface State {
  isOpen: boolean;
  actions: {
    setIsOpen: (_: boolean) => void;
  };
}

export const useBallotBoxReportState = create<State>()((set) => ({
  isOpen: false,
  actions: {
    setIsOpen: (isOpen) => set(() => ({ isOpen })),
  },
}));
