import { useEffect } from "react";
import { useWeather } from "@/entities/weather/useWeather";
import { useForecast } from "@/entities/weather/useForecast";
import { KakaoSearchBox } from "@/features/search/components/KakaoSearchBox";
import { KakaoMap } from "@/features/map/ui/KakaoMap";
import { useOutletContext, useNavigate } from "react-router-dom";

type LayoutContext = {
  coords: { lat: number; lon: number } | null;
  setCoords: (coords: { lat: number; lon: number }) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const Home = () => {
  const { coords, setCoords, sidebarOpen, setSidebarOpen } =
    useOutletContext<LayoutContext>();
  const navigate = useNavigate();

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
  const { data: forecastData } = useForecast(
    coords?.lat || 0,
    coords?.lon || 0
  );

  const handleSearchSelect = (lat: number, lon: number) => {
    navigate(`/weather/${lat}/${lon}`);
  };

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
    <div className="p-4 bg-gray-50">
      {/* 햄버거 버튼 - 공간은 항상 유지, 닫혔을 때만 보임 */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors ${
            sidebarOpen ? "invisible" : "visible"
          }`}
        >
          <img src="/favorite.svg" alt="메뉴" className="size-5" />
        </button>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* 날씨 정보 박스 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-start justify-between gap-4">
            {/* 왼쪽: 날씨 정보 */}
            <div className="flex-1">
              {/* 평균 온도 - 가장 크게 */}
              <p className="text-5xl md:text-6xl font-bold text-gray-800">
                {Math.round(data?.main.temp || 0)}℃
              </p>

              {/* 날씨 설명 */}
              <p className="text-xl text-gray-700 mt-2">
                {data?.weather[0].description}
              </p>

              {/* 지역 이름 - 작게 */}
              <p className="text-sm text-gray-500 mt-2">{data?.name}</p>

              {/* 최저/최고 온도 */}
              <p className="text-sm text-gray-600 mt-1">
                최저 {Math.round(data?.main.temp_min || 0)}℃ / 최고{" "}
                {Math.round(data?.main.temp_max || 0)}℃
              </p>
            </div>

            {/* 오른쪽: 날씨 아이콘 */}
            <div className="shrink-0">
              <img
                src={`https://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`}
                alt={data?.weather[0].description}
                className="w-24 h-24 md:w-32 md:h-32"
              />
            </div>
          </div>
          <button
            onClick={() => navigate(`/weather/${coords.lat}/${coords.lon}`)}
            className="mt-4 w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            현재 위치 상세 날씨 보기
          </button>
        </div>

        {/* 시간대별 날씨 */}
        {forecastData && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              시간대별 날씨
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {forecastData.list.slice(0, 8).map((item, index) => {
                const date = new Date(item.dt * 1000);
                const hours = date.getHours();
                const timeStr = `${hours}:00`;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center w-24 shrink-0 p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                      {timeStr}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                      className="w-12 h-12 my-1"
                    />
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      {Math.round(item.main.temp)}℃
                    </p>
                    <p className="text-xs text-gray-500 text-center line-clamp-2 wrap-break-word w-full">
                      {item.weather[0].description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 검색 박스 */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <KakaoSearchBox onSelect={handleSearchSelect} />
        </div>

        {/* 지도 박스 */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <KakaoMap lat={coords.lat} lon={coords.lon} />
        </div>
      </div>
    </div>
  );
};
