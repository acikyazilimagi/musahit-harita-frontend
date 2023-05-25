import { ApiClient } from "@/features/api-client";
import { create } from "zustand";

export const useSingletonsStore = create<{ api: ApiClient }>()(() => ({
  api: new ApiClient(),
}));
