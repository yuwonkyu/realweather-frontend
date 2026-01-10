import { useQuery } from "@tanstack/react-query";
import { getWeatherByCoords } from "./api";

export const useWeather = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeatherByCoords(lat, lon),
    enabled: !!lat && !!lon,
  });
};
