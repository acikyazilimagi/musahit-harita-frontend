import { Filter } from "@/components/Filter/Filter";
import { FilterHeader } from "@/components/Filter/FilterHeader";
import { useTranslation } from "next-i18next";
import { FilterControl } from "@/components/Filter/FilterControl";
import { Button, SxProps, Theme } from "@mui/material";
import { useVotingLocations } from "./useVotingLocations";
import {
  City,
  District,
  getAllCities,
  getDistricts,
  getNeighborhoods,
} from "@/data/models";
import { useMap } from "react-leaflet";

const ZOOM_LEVEL_CITY = 9;
const ZOOM_LEVEL_DISTRICT = 11;
const ZOOM_LEVEL_NEIGHBORHOOD = 13;

interface HasName {
  name: string;
}

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const sortByName = (a: HasName, b: HasName) => {
  return a.name.localeCompare(b.name, "tr", { sensitivity: "base" });
};

export const FilterVotingLocations = () => {
  const { t } = useTranslation("home");
  const {
    isOpen,
    actions,
    selectedCity,
    selectedDistrict,
    selectedNeighborhood,
  } = useVotingLocations();
  const map = useMap();

  if (!isOpen) {
    return null;
  }

  return (
    <Filter
      isOpen={isOpen}
      header={
        <FilterHeader
          title={t("filter.findVotingLocationsTitle")}
          onClose={() => {
            actions.setIsOpen(false);
          }}
        />
      }
    >
      <FilterControl<City>
        value={selectedCity}
        label={t("filter.city")}
        onChange={(_, city) => {
          if (!city) {
            actions.setSelectedCity(null);
            actions.setSelectedDistrict(null);
            actions.setSelectedNeighborhood(null);
            return;
          }
          actions.setSelectedCity(city);
        }}
        options={getAllCities().sort(sortByName)}
      />

      <FilterControl<District>
        disabled={!selectedCity?.id}
        value={selectedDistrict}
        label={t("filter.district")}
        options={
          selectedCity?.id ? getDistricts(selectedCity.id).sort(sortByName) : []
        }
        onChange={(_, district) => {
          if (!district) {
            actions.setSelectedDistrict(null);
            actions.setSelectedNeighborhood(null);
            return;
          }
          actions.setSelectedDistrict(district);
        }}
      />

      <FilterControl
        disabled={!selectedDistrict?.id}
        value={selectedNeighborhood}
        label={t("filter.neighborhood")}
        options={
          selectedCity?.id && selectedDistrict?.id
            ? getNeighborhoods(selectedCity.id, selectedDistrict.id).sort(
                sortByName
              )
            : []
        }
        onChange={(_, hood) => {
          if (!hood) {
            actions.setSelectedNeighborhood(null);
            return;
          }
          actions.setSelectedNeighborhood(hood);
        }}
      />

      <Button
        sx={styles.button}
        variant="contained"
        disabled={!selectedCity}
        onClick={() => {
          if (!selectedCity) return;

          let lat = selectedCity.lat;
          let lng = selectedCity.lng;
          let zoomLevel = ZOOM_LEVEL_CITY;

          if (selectedDistrict) {
            lat = selectedDistrict.lat;
            lng = selectedDistrict.lng;
            zoomLevel = ZOOM_LEVEL_DISTRICT;
          }

          if (selectedNeighborhood) {
            lat = selectedNeighborhood.lat;
            lng = selectedNeighborhood.lng;
            zoomLevel = ZOOM_LEVEL_NEIGHBORHOOD;
          }

          map.setView([lat, lng], zoomLevel, { animate: true });
        }}
      >
        {t("filter.applyOptionsLabel")}
      </Button>
    </Filter>
  );
};

const styles: IStyles = {
  button: () => ({
    height: "48px",
    borderRadius: "8px !important",
  }),
};
