import { useEffect } from "react";
import { useWeather } from "@/entities/weather/useWeather";
import { KakaoSearchBox } from "@/features/search/components/KakaoSearchBox";
import { KakaoMap } from "@/features/map/ui/KakaoMap";
import { useOutletContext } from "react-router-dom";

type LayoutContext = {
  coords: { lat: number; lon: number } | null;
  setCoords: (coords: { lat: number; lon: number }) => void;
};

export const Home = () => {
  const { coords, setCoords } = useOutletContext<LayoutContext>();

  useEffect(() => {
    if (!coords) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      });
    }
  }, [coords, setCoords]);

  const { data, isLoading } = useWeather(coords?.lat || 0, coords?.lon || 0);

  if (!coords)
    return (
      <div className="flex items-center justify-center h-screen">
        위치 정보를 가져오는 중...
      </div>
    );
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50 ">
      <div className="max-w-2xl space-y-4">
        {/* 날씨 정보 박스 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h1 className="text-2xl font-bold mb-2">{data?.name}</h1>
          <p className="text-3xl font-semibold text-gray-800">
            {data?.main.temp}℃
          </p>
          <p className="text-gray-600 mt-1">
            {data?.main.temp_min}℃ / {data?.main.temp_max}℃
          </p>
        </div>

        {/* 검색 박스 */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <KakaoSearchBox onSelect={(lat, lon) => setCoords({ lat, lon })} />
        </div>

        {/* 지도 박스 */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <KakaoMap lat={coords.lat} lon={coords.lon} />
        </div>
      </div>
    </div>
  );
};
