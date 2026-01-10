import { useQuery } from "@tanstack/react-query";
import { getCoordsByName } from "./api";

export const useGeocode = (name: string) => {
  return useQuery({
    queryKey: ["geocode", name],
    queryFn: () => getCoordsByName(name),
    enabled: !!name,
  });
};
