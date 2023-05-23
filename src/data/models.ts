import { Point } from "@/types";
import everything from "@/data/tr-everything.json";
const geoData = everything as Record<string, City>;

export interface City extends Point {
  id: number;
  name: string;
  districts: District[];
}

export const getCity = (id: number) => geoData[id.toString()];

export const getAllCities = () => Object.values(geoData);

export interface District extends Point {
  id: number;
  cityID: number;
  name: string;
  neighborhoods: Neighborhood[];
}

export const getDistricts = (cityID: number) => {
  return getCity(cityID)?.districts ?? [];
};

export const getDistrict = (cityID: number, districtID: number) => {
  const districts = getDistricts(cityID);
  return districts.find((district) => district.id === districtID);
};

export interface Neighborhood extends Point {
  id: number;
  cityID: number;
  districtID: number;
  name: string;
}

export const getNeighborhoods = (cityID: number, districtID: number) => {
  const district = getDistrict(cityID, districtID);
  if (!district) {
    return [];
  }

  return district.neighborhoods;
};

export const getNeighborhood = (
  cityID: number,
  districtID: number,
  hoodID: number
) => {
  return getNeighborhoods(cityID, districtID).find((n) => n.id === hoodID);
};

export const getAllNeighborhoods = () => {
  let hoods: Neighborhood[] = [];

  Object.values(geoData).forEach((city) => {
    city?.districts.forEach((district) => {
      hoods = hoods.concat(district.neighborhoods);
    });
  });

  return hoods;
};
