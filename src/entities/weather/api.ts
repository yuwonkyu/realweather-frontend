import { weatherApi } from "@/shared/api/axios";

export const getWeatherByCoords = async (lat: number, lon: number) => {
  const { data } = await weatherApi.get("weather", {
    params: { lat, lon },
  });
  return data;
};
