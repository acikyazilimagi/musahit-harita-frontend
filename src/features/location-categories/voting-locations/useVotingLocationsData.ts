import { usePrevious } from "@/hooks/usePrevious";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useVotingLocations } from "./useVotingLocations";

import cityDistricts from "@/data/tr-city-districts.json";

export const useVotingLocationsData = () => {
  const { selectedDistrictId, selectedCity, actions } = useVotingLocations();
  const map = useMap();

  // city is changed: zoom into city
  useEffect(() => {
    if (!selectedCity?.id) return;

    map.setView([selectedCity.latitude, selectedCity.longitude], 9, {
      animate: true,
    });
  }, [map, selectedCity?.id, selectedCity?.latitude, selectedCity?.longitude]);

  const prevDistrictId = usePrevious(selectedDistrictId);
  // district is changed: zoom into district & reset neighborhood and school
  useEffect(() => {
    if (selectedDistrictId && prevDistrictId !== selectedDistrictId) {
      const district = cityDistricts.find(
        (district) => district.id === selectedDistrictId
      );
      if (district) {
        map.setView([district.latitude, district.longitude], 11, {
          animate: true,
        });
        actions.setSelectedNeighborhoodId(null);
        actions.setSelectedSchoolId(null);
      }
    }
  }, [actions, map, prevDistrictId, selectedDistrictId]);
};
