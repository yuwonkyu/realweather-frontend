import { weatherApi } from "@/shared/api/axios";

export const getCoordsByName = async (name: string) => {
  const { data } = await weatherApi.get("geo/1.0/direct", {
    params: {
      q: name,
      limit: 1,
    },
  });

  if (!data || data.length === 0) {
    throw new Error("Location not found");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
  };
};
