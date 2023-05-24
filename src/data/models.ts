import { Point } from "@/types";
import everything from "@/data/tr-everything.json";
const geoData = everything as Record<string, City>;

export interface City extends Point {
  id: number;
  name: string;
  districts: District[];
}

// use the cached value to not re-calculate static values
const allCities = Object.values(geoData);
export const getAllCities = () => allCities;

export const getCity = (id: number) => geoData[id.toString()];

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

let allNeighborhoods: Neighborhood[] = [];

allCities.forEach((city) => {
  city.districts.forEach((district) => {
    allNeighborhoods = allNeighborhoods.concat(district.neighborhoods);
  });
});
// return the cached value to not re-calculate static values
export const getAllNeighborhoods = () => allNeighborhoods;

let allNeighborhoodsByID: Record<number, Neighborhood> = {};
allNeighborhoods.forEach((hood) => {
  allNeighborhoodsByID[hood.id] = hood;
});
// return the cached value to not re-calculate static values
export const getAllNeighborhoodsByID = () => allNeighborhoodsByID;
