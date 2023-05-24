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

  // FIXME:
  // when user reloads a url with a district selected, it zooms into the city instead of district.
  // same goes for the neighborhoods, user always zooms into the city instead of neighborhood.
  // https://github.com/acikkaynak/musahit-harita-frontend/issues/33
  //
  // move all of these into one effect
  // then do checks in following order:
  // neighborhoods -> districts -> cities
  //
  // the reason we start from smaller unit is because we want to be
  // zooming into the smallest unit, then return early

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
