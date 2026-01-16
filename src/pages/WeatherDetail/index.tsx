import {
  useParams,
  useNavigate,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import { useWeather } from "@/entities/weather/useWeather";
import { useForecast } from "@/entities/weather/useForecast";
import { useReverseGeocode } from "@/entities/location/useReverseGeocode";
import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";
import { PageTransition } from "@/shared/ui/PageTransition";

type LayoutContext = {
  coords: { lat: number; lon: number } | null;
  setCoords: (coords: { lat: number; lon: number }) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const WeatherDetail = () => {
  const { lat, lon } = useParams<{ lat: string; lon: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { favorites, add, remove } = useFavoritesStore();
  const { sidebarOpen, setSidebarOpen } = useOutletContext<LayoutContext>();

  // URL 쿼리에서 장소명 가져오기 (없으면 API 응답의 name 사용)
  const placeName = searchParams.get("name");

  const latitude = parseFloat(lat || "0");
  const longitude = parseFloat(lon || "0");

  const {
    data: currentWeather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useWeather(latitude, longitude);
  const { address: koreanAddress } = useReverseGeocode(latitude, longitude);
  const {
    data: forecast,
    isLoading: forecastLoading,
    error: forecastError,
  } = useForecast(latitude, longitude);

  // 즐겨찾기 여부 확인
  const isFavorite = favorites.some(
    (fav) => fav.lat === latitude && fav.lon === longitude
  );

  // 즐겨찾기 토글
  const handleToggleFavorite = () => {
    if (isFavorite) {
      const favorite = favorites.find(
        (fav) => fav.lat === latitude && fav.lon === longitude
      );
      if (favorite) {
        remove(favorite.id);
      }
    } else {
      if (favorites.length >= 6) {
        alert("즐겨찾기는 최대 6개까지 추가할 수 있습니다.");
        return;
      }
      add({
        id: Date.now().toString(),
        name: placeName || currentWeather?.name || "알 수 없음",
        lat: latitude,
        lon: longitude,
      });
    }
  };

  if (weatherLoading || forecastLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <img src="/loading.png" alt="로딩 중" className="size-30" />
        <p className="text-gray-600">날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (weatherError || forecastError || !currentWeather || !forecast) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800">
          날씨 정보를 불러올 수 없습니다
        </h2>
        <p className="text-gray-600 text-center">
          네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            뒤로 가기
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 오늘의 시간대별 날씨 (24시간)
  const todayForecasts = forecast.list.slice(0, 8);

  // 5일간 날씨 예보 (일별 데이터)
  const dailyForecasts = forecast.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  // 풍향을 방향으로 변환
  const getWindDirection = (deg: number) => {
    const directions = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <PageTransition>
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors border border-gray-200 ${
                  sidebarOpen ? "invisible" : "visible"
                }`}
              >
                <img src="/arrow-left.svg" alt="뒤로가기" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                className={`flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors border border-gray-200 ${
                  sidebarOpen ? "invisible" : "visible"
                }`}
              >
                <img src="/favorite.svg" alt="메뉴" className="size-5" />
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                {placeName || currentWeather.name}
              </h1>
              {koreanAddress && (
                <p className="text-sm text-gray-500 mt-1">{koreanAddress}</p>
              )}
            </div>
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label={isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
            >
              <img
                src={isFavorite ? "/on_favorite.svg" : "/off_favorite.svg"}
                alt={isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
                className="size-8"
              />
            </button>
          </div>

          {/* 현재 날씨 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold">
                  {currentWeather.main.temp}°C
                </p>
                <p className="text-gray-600 mt-2">
                  {currentWeather.weather[0].description}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  최저: {currentWeather.main.temp_min}°C / 최고:{" "}
                  {currentWeather.main.temp_max}°C
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                alt={currentWeather.weather[0].description}
                className="w-32 h-32"
              />
            </div>
          </div>

          {/* 시간대별 날씨 */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              시간대별 날씨
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {todayForecasts.map((item, index) => {
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
                    {item.pop !== undefined && item.pop > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        💧 {Math.round(item.pop * 100)}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5일간 날씨 예보 */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              5일간 예보
            </h2>
            <div className="space-y-3">
              {dailyForecasts.map((item, index) => {
                const date = new Date(item.dt * 1000);
                const dayName = date.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                });

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <p className="text-sm font-medium text-gray-700 w-24">
                      {dayName}
                    </p>
                    <div className="flex items-center gap-2 flex-1">
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                        className="w-10 h-10"
                      />
                      <p className="text-sm text-gray-600 flex-1">
                        {item.weather[0].description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">
                        {Math.round(item.main.temp_min)}°
                      </p>
                      <div className="w-16 h-2 bg-linear-to-r from-blue-300 to-red-300 rounded"></div>
                      <p className="text-sm font-semibold text-gray-800">
                        {Math.round(item.main.temp_max)}°
                      </p>
                    </div>
                    {item.pop !== undefined && item.pop > 0 && (
                      <p className="text-xs text-blue-600 ml-2 w-12 text-right">
                        💧 {Math.round(item.pop * 100)}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 일출/일몰 시간 */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              일출/일몰
            </h2>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">일출</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {new Date(
                    currentWeather.sys.sunrise * 1000
                  ).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-4xl text-gray-300">→</div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">일몰</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {new Date(
                    currentWeather.sys.sunset * 1000
                  ).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* 날씨 상세 정보 */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              상세 정보
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">체감 온도</p>
                <p className="text-xl font-semibold text-gray-800">
                  {Math.round(currentWeather.main.feels_like)}℃
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">습도</p>
                <p className="text-xl font-semibold text-gray-800">
                  {currentWeather.main.humidity}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">풍속</p>
                <p className="text-xl font-semibold text-gray-800">
                  {currentWeather.wind.speed}m/s
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">풍향</p>
                <p className="text-xl font-semibold text-gray-800">
                  {getWindDirection(currentWeather.wind.deg)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">기압</p>
                <p className="text-xl font-semibold text-gray-800">
                  {currentWeather.main.pressure}hPa
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">가시거리</p>
                <p className="text-xl font-semibold text-gray-800">
                  {(currentWeather.visibility / 1000).toFixed(1)}km
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">구름</p>
                <p className="text-xl font-semibold text-gray-800">
                  {currentWeather.clouds.all}%
                </p>
              </div>
            </div>
          </div>

          {/* 강수 정보 (있을 경우) */}
          {todayForecasts.some((item) => item.rain || item.snow) && (
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                강수 정보
              </h2>
              <div className="space-y-2">
                {todayForecasts
                  .filter((item) => item.rain || item.snow)
                  .map((item, index) => {
                    const date = new Date(item.dt * 1000);
                    const timeStr = date.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >
                        <p className="text-sm text-gray-600">{timeStr}</p>
                        <div className="flex gap-4">
                          {item.rain && (
                            <p className="text-sm text-blue-600">
                              🌧️ 강우량: {item.rain["3h"]}mm
                            </p>
                          )}
                          {item.snow && (
                            <p className="text-sm text-blue-400">
                              ❄️ 적설량: {item.snow["3h"]}mm
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
