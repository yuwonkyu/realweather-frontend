import { useCallback } from "react";
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
import { cn } from "@/shared/utils/cn";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { SunriseSunset } from "./components/SunriseSunset";
import { WeatherDetails } from "./components/WeatherDetails";
import { PrecipitationInfo } from "./components/PrecipitationInfo";

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
  const handleToggleFavorite = useCallback(() => {
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
      const favoriteName = (
        placeName ||
        currentWeather?.name ||
        "알 수 없음"
      ).slice(0, 20);
      add({
        id: Date.now().toString(),
        name: favoriteName,
        lat: latitude,
        lon: longitude,
      });
    }
  }, [
    isFavorite,
    favorites,
    latitude,
    longitude,
    remove,
    add,
    placeName,
    currentWeather,
  ]);

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

  const todayForecasts = forecast.list.slice(0, 8);
  const dailyForecasts = forecast.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  return (
    <PageTransition>
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className={cn(
                  "flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors border border-gray-200",
                  sidebarOpen && "invisible"
                )}
              >
                <img src="/arrow-left.svg" alt="뒤로가기" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                className={cn(
                  "flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors border border-gray-200",
                  sidebarOpen && "invisible"
                )}
              >
                <img src="/favorite.svg" alt="메뉴" className="size-5" />
              </button>
            </div>
            <div className="text-center flex-1 px-2 min-w-0">
              <h1
                className="text-2xl font-bold truncate cursor-default"
                title={placeName || currentWeather.name}
              >
                {placeName || currentWeather.name}
              </h1>
              {koreanAddress && (
                <p
                  className="text-sm text-gray-500 mt-1 truncate"
                  title={koreanAddress}
                >
                  {koreanAddress}
                </p>
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

          <CurrentWeather weather={currentWeather} />
          <HourlyForecast forecasts={todayForecasts} />
          <DailyForecast forecasts={dailyForecasts} />
          <SunriseSunset
            sunrise={currentWeather.sys.sunrise}
            sunset={currentWeather.sys.sunset}
          />
          <WeatherDetails weather={currentWeather} />
          <PrecipitationInfo forecasts={todayForecasts} />
        </div>
      </div>
    </PageTransition>
  );
};
