import useSWR from "swr";
import { getAllNeighborhoodsByID, type Neighborhood } from "@/data/models";
import { useSingletonsStore } from "@/features/singletons";
import type { IntensityData } from "@/features/api-client";
import { useMemo } from "react";

const FIVE_MINUTES = 5 * 60 * 60 * 1000;

const hoods = getAllNeighborhoodsByID();

export interface NeighborhoodIntensity {
  neighborhood: Neighborhood;
  intensity: IntensityData;
}

const useFetchIntensityData = () => {
  const { api } = useSingletonsStore();

  return useSWR(["feeds", "intensity"], () => api.fetchFeeds(), {
    keepPreviousData: true,
    revalidateOnFocus: true,
    refreshInterval: FIVE_MINUTES,
  });
};

export const useNeighborhoodIntensityData = () => {
  const { data } = useFetchIntensityData();

  return useMemo(() => {
    if (!data) {
      return null;
    }
    return data.map((intensity) => {
      return {
        intensity,
        neighborhood: hoods[intensity.neighborhoodID],
      } as NeighborhoodIntensity;
    });
  }, [data]);
};
