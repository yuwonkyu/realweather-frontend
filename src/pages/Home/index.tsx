import { useEffect, useState } from "react";
import { useWeather } from "@/entities/weather/useWeather";

export const Home = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  const { data, isLoading } = useWeather(coords?.lat || 0, coords?.lon || 0);

  if (isLoading) return <div>로딩 중...</div>;
  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.main.temp}℃</p>
      <p>
        {data?.main.temp_min}℃ / {data?.main.temp_max}℃
      </p>
    </div>
  );
};
