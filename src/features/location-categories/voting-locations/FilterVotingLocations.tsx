import { Filter } from "@/components/Filter/Filter";
import { FilterHeader } from "@/components/Filter/FilterHeader";
import { useTranslation } from "next-i18next";
import { FilterControl } from "@/components/Filter/FilterControl";
import { MenuItem, SelectChangeEvent } from "@mui/material";
import { useVotingLocations } from "./useVotingLocations";
import {
  getAllCities,
  getCity,
  getDistrict,
  getDistricts,
  getNeighborhood,
  getNeighborhoods,
} from "@/data/models";

interface HasName {
  name: string;
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
      <FilterControl
        value={selectedCity?.id}
        label={t("filter.city")}
        onChange={(event: SelectChangeEvent<number>) => {
          const { value } = event.target;
          if (typeof value !== "number") return;
          const city = getCity(value);
          if (!city) return;
          actions.setSelectedCity(city);
        }}
      >
        {getAllCities()
          .sort(sortByName)
          .map((city) => {
            return (
              <MenuItem key={city.id} value={city.id ?? ""}>
                {city.name}
              </MenuItem>
            );
          })}
      </FilterControl>

      <FilterControl
        disabled={!selectedCity?.id}
        value={selectedDistrict?.id ?? ""}
        label={t("filter.district")}
        onChange={(event: SelectChangeEvent<number>) => {
          const { value } = event.target;
          if (typeof value !== "number") return;
          const district = getDistrict(selectedCity!.id, value);
          if (!district) return;
          actions.setSelectedDistrict(district);
        }}
      >
        {selectedCity?.id &&
          getDistricts(selectedCity.id)
            .sort(sortByName)
            .map((district) => {
              return (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              );
            })}
      </FilterControl>

      <FilterControl
        disabled={!selectedDistrict?.id}
        value={selectedNeighborhood?.id ?? ""}
        label={t("filter.neighborhood")}
        onChange={(event: SelectChangeEvent<number>) => {
          const { value } = event.target;

          if (typeof value !== "number") return;
          const hood = getNeighborhood(
            selectedCity!.id,
            selectedDistrict!.id,
            value
          );
          if (!hood) return;
          actions.setSelectedNeighborhood(hood);
        }}
      >
        {selectedCity?.id &&
          selectedDistrict?.id &&
          getNeighborhoods(selectedCity.id, selectedDistrict.id)
            .sort(sortByName)
            .map((district) => {
              return (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              );
            })}
      </FilterControl>
    </Filter>
  );
};
