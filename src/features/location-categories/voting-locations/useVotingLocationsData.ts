import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useVotingLocations } from "./useVotingLocations";

const ZOOM_LEVEL_CITY = 9;
const ZOOM_LEVEL_DISTRICT = 11;
const ZOOM_LEVEL_NEIGHBORHOOD = 13;

export const useVotingLocationsData = () => {
  const { selectedNeighborhood, selectedDistrict, selectedCity } =
    useVotingLocations();
  const map = useMap();

  // city is changed: zoom into city
  useEffect(() => {
    if (!selectedCity) return;
    map.setView([selectedCity.lat, selectedCity.lng], ZOOM_LEVEL_CITY, {
      animate: true,
    });
  }, [map, selectedCity]);

  // district is changed: zoom into district
  useEffect(() => {
    if (!selectedDistrict) return;

    map.setView(
      [selectedDistrict.lat, selectedDistrict.lng],
      ZOOM_LEVEL_DISTRICT,
      { animate: true }
    );
  }, [map, selectedDistrict]);

  // neighborhood is changed: zoom into neighborhood
  useEffect(() => {
    if (!selectedNeighborhood) return;
    map.setView(
      [selectedNeighborhood.lat, selectedNeighborhood.lng],
      ZOOM_LEVEL_NEIGHBORHOOD,
      { animate: true }
    );
  }, [map, selectedNeighborhood]);
};
