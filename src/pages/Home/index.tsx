import { useEffect, useState } from "react";
import { useWeather } from "@/entities/weather/useWeather";
import { KakaoSearchBox } from "@/features/search/components/KakaoSearchBox";
import { KakaoMap } from "@/features/map/ui/KakaoMap";

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

  if (!coords) return <div>위치 정보를 가져오는 중...</div>;
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <KakaoSearchBox onSelect={(lat, lon) => setCoords({ lat, lon })} />
      <KakaoMap lat={coords.lat} lon={coords.lon} />
      <h1>{data?.name}</h1>
      <p>{data?.main.temp}℃</p>
      <p>
        {data?.main.temp_min}℃ / {data?.main.temp_max}℃
      </p>
    </div>
  );
};
