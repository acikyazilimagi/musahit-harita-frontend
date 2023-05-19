import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useVotingLocations } from "./useVotingLocations";

export const useVotingLocationsData = () => {
  const { selectedDistrict, selectedCity } = useVotingLocations();
  const map = useMap();

  // city is changed: zoom into city
  useEffect(() => {
    if (!selectedCity?.id) return;

    map.setView([selectedCity.latitude, selectedCity.longitude], 9, {
      animate: true,
    });
  }, [map, selectedCity?.id, selectedCity?.latitude, selectedCity?.longitude]);

  // district is changed: zoom into district
  useEffect(() => {
    if (!selectedDistrict?.id) return;

    map.setView([selectedDistrict.latitude, selectedDistrict.longitude], 11, {
      animate: true,
    });
  }, [
    map,
    selectedDistrict?.id,
    selectedDistrict?.latitude,
    selectedDistrict?.longitude,
  ]);
};
