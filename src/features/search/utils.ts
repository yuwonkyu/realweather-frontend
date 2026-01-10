import { allDistrictsNames } from "@/entities/location/data";

export const searchDistricts = (keyword: string) => {
  if (!keyword) return [];

  return allDistrictsNames
    .filter((name) => name.includes(keyword))
    .slice(0, 10);
};
