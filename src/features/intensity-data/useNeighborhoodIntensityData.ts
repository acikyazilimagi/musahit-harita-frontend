import useSWR, { mutate } from "swr";
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

const intensityDataKey = "intensity:all";

const useFetchIntensityData = () => {
  const { api } = useSingletonsStore();

  return useSWR(intensityDataKey, () => api.fetchFeeds(), {
    keepPreviousData: true,
    revalidateOnFocus: true,
    refreshInterval: FIVE_MINUTES,
  });
};

const intensityDetailDataKey = "intensity:single";

const useFetchIntensityDetailData = (neighborhoodID: string | null) => {
  const { api } = useSingletonsStore();

  return useSWR(
    [intensityDetailDataKey, neighborhoodID],
    ([_, id]) => (!id ? null : api.fetchDetail(id)),
    {
      keepPreviousData: true,
      revalidateOnFocus: true,
    }
  );
};

export const useNeighborhoodIntensityData = () => {
  const { data, isLoading, isValidating, mutate } = useFetchIntensityData();

  const intensities = useMemo(() => {
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

  return {
    isLoading,
    isValidating,
    mutate,
    data: intensities,
  };
};

export const useNeighborhoodIntensityDetailData = (id: string | null) => {
  const { data } = useFetchIntensityDetailData(id);
  return data ?? null;
};

export const invalidateIntensityData = () => {
  return mutate((key) => key === intensityDataKey);
};

export const invalidateIntensityDetailData = (id: string) => {
  return mutate((key) => {
    return Array.isArray(key) && key[0] === "feeds" && key[1] === id;
  });
};
