import { useEffect, useState, useCallback } from "react";
import { useWeather } from "@/entities/weather/useWeather";
import { useForecast } from "@/entities/weather/useForecast";
import { useReverseGeocode } from "@/entities/location/useReverseGeocode";
import { KakaoSearchBox } from "@/features/search/components/KakaoSearchBox";
import { FavoritesList } from "@/features/favorites/ui/FavoritesList";
import { useOutletContext, useNavigate } from "react-router-dom";
import { PageTransition } from "@/shared/ui/PageTransition";
import { Loading } from "@/shared/ui/Loading";
import { ErrorDisplay } from "@/shared/ui/ErrorDisplay";
import { cn } from "@/shared/utils/cn";
import { LocationErrorBanner } from "./components/LocationErrorBanner";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { HourlyForecastSection } from "./components/HourlyForecastSection";

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

  const handleSearchSelect = useCallback(
    (lat: number, lon: number, name: string) => {
      navigate(`/weather/${lat}/${lon}?name=${encodeURIComponent(name)}`);
    },
    [navigate]
  );

  const handleRetryLocation = useCallback(() => {
    setCoords(null);
    setLocationError(null);
  }, [setCoords]);

  if (!coords) return <Loading message="위치 정보를 가져오는 중..." />;

  if (isLoading) return <Loading message="날씨 정보를 불러오는 중..." />;

  if (error)
    return (
      <ErrorDisplay
        title="날씨 정보를 불러올 수 없습니다"
        message="네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요."
        onRetry={() => window.location.reload()}
      />
    );

  return (
    <PageTransition>
      <div className="p-4 bg-gray-50">
        {locationError && (
          <LocationErrorBanner
            error={locationError}
            onRetry={handleRetryLocation}
          />
        )}

        {/* 상단: 햄버거 버튼 + 검색 박스 */}
        <div className="max-w-4xl mx-auto mb-2">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={cn(
                "flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors border border-gray-200",
                sidebarOpen && "invisible"
              )}
            >
              <img src="/favorite.svg" alt="메뉴" className="size-5" />
            </button>

            <div className="flex-1 max-w-md bg-white rounded-lg shadow p-3 border border-gray-200">
              <KakaoSearchBox onSelect={handleSearchSelect} />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <CurrentWeatherCard
            temp={data?.main.temp || 0}
            description={data?.weather[0].description || ""}
            location={koreanAddress || data?.name || ""}
            tempMin={data?.main.temp_min || 0}
            tempMax={data?.main.temp_max || 0}
            icon={data?.weather[0].icon || ""}
            onDetailClick={() =>
              navigate(
                `/weather/${coords.lat}/${coords.lon}?name=${encodeURIComponent(
                  koreanAddress || data?.name || "현재 위치"
                )}`
              )
            }
          />

          {forecastData && (
            <HourlyForecastSection forecasts={forecastData.list.slice(0, 8)} />
          )}

          <FavoritesList onSelect={handleSearchSelect} />
        </div>
      </div>
    </PageTransition>
  );
};
