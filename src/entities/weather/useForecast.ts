import { useQuery } from "@tanstack/react-query";
import { getForecastByCoords } from "./api";
import type { ForecastResponse } from "./types";

export const useForecast = (lat: number, lon: number) => {
  return useQuery<ForecastResponse>({
    queryKey: ["forecast", lat, lon],
    queryFn: () => getForecastByCoords(lat, lon),
    enabled: !!lat && !!lon,
  });
};
