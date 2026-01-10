import { useEffect, useState } from "react";
import { useWeather } from "@/entities/weather/useWeather";
import { SearchBox } from "@/features/search/components/SearchBox";
import { useGeocode } from "@/entities/location/useGeocode";

export const Home = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  const { data: geo } = useGeocode(selectedName);

  const lat = geo?.lat || coords?.lat;
  const lon = geo?.lon || coords?.lon;

  const { data, isLoading } = useWeather(lat || 0, lon || 0);

  if (!coords && !selectedName) return <div>위치 정보를 가져오는 중...</div>;
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <SearchBox onSelect={setSelectedName} />
      <h1>{data?.name}</h1>
      <p>{data?.main.temp}℃</p>
      <p>
        {data?.main.temp_min}℃ / {data?.main.temp_max}℃
      </p>
      <p>{data?.weather[0].description}</p>
    </div>
  );
};
