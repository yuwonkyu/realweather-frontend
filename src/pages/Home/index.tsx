import { useEffect, useState } from "react";
import { useWeather } from "@/entities/weather/useWeather";
import { useForecast } from "@/entities/weather/useForecast";
import { useReverseGeocode } from "@/entities/location/useReverseGeocode";
import { KakaoSearchBox } from "@/features/search/components/KakaoSearchBox";
import { FavoritesList } from "@/features/favorites/ui/FavoritesList";
import { useOutletContext, useNavigate } from "react-router-dom";
import { PageTransition } from "@/shared/ui/PageTransition";

type LayoutContext = {
  coords: { lat: number; lon: number } | null;
  setCoords: (coords: { lat: number; lon: number } | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const Home = () => {
  const { coords, setCoords, sidebarOpen, setSidebarOpen } =
    useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error("위치 정보 가져오기 실패:", error);
          setLocationError(
            error.code === error.PERMISSION_DENIED
              ? "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요."
              : "위치 정보를 가져올 수 없습니다. 다시 시도해주세요."
          );
          // 기본 위치 (서울)로 설정
          setCoords({ lat: 37.5665, lon: 126.978 });
        }
      );
    }
  }, [coords, setCoords]);

  const { data, isLoading, error } = useWeather(
    coords?.lat || 0,
    coords?.lon || 0
  );
  const { data: forecastData } = useForecast(
    coords?.lat || 0,
    coords?.lon || 0
  );
  const { address: koreanAddress } = useReverseGeocode(
    coords?.lat || 0,
    coords?.lon || 0
  );

  const handleSearchSelect = (lat: number, lon: number, name: string) => {
    navigate(`/weather/${lat}/${lon}?name=${encodeURIComponent(name)}`);
  };

  const handleRetryLocation = () => {
    setCoords(null);
    setLocationError(null);
  };

  if (!coords)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <img src="/loading.png" alt="로딩 중" className="size-30" />
        <p className="text-gray-600">위치 정보를 가져오는 중...</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <img src="/loading.png" alt="로딩 중" className="size-30" />
        <p className="text-gray-600">날씨 정보를 불러오는 중...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800">
          날씨 정보를 불러올 수 없습니다
        </h2>
        <p className="text-gray-600 text-center">
          네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );

  return (
    <PageTransition>
      <div className="p-4 bg-gray-50">
        {/* 위치 권한 에러 메시지 */}
        {locationError && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-yellow-800 font-medium">{locationError}</p>
                <p className="text-yellow-700 text-sm mt-1">
                  현재 서울의 날씨를 표시하고 있습니다.
                </p>
              </div>
              <button
                onClick={handleRetryLocation}
                className="text-yellow-600 hover:text-yellow-800 font-medium text-sm"
              >
                재시도
              </button>
            </div>
          </div>
        )}

        {/* 상단: 햄버거 버튼 + 검색 박스 */}
        <div className="max-w-4xl mx-auto mb-2">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors border border-gray-200 ${
                sidebarOpen ? "invisible" : "visible"
              }`}
            >
              <img src="/favorite.svg" alt="메뉴" className="size-5" />
            </button>

            <div className="flex-1 max-w-md bg-white rounded-lg shadow p-3 border border-gray-200">
              <KakaoSearchBox onSelect={handleSearchSelect} />
            </div>
          </div>
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
                <p className="text-sm text-gray-500 mt-2">
                  {koreanAddress || data?.name}
                </p>

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
              onClick={() =>
                navigate(
                  `/weather/${coords.lat}/${
                    coords.lon
                  }?name=${encodeURIComponent(
                    koreanAddress || data?.name || "현재 위치"
                  )}`
                )
              }
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

          {/* 즐겨찾기 카드 */}
          <FavoritesList onSelect={handleSearchSelect} />
        </div>
      </div>
    </PageTransition>
  );
};
