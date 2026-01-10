import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGeocode = (address: string | null) => {
  return useQuery({
    queryKey: ["geocode", address],
    enabled: !!address,
    queryFn: async () => {
      const res = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: address,
            limit: 1,
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          },
        }
      );

      return res.data[0];
    },
  });
};
