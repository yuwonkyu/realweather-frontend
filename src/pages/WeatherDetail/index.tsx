import { useParams, useNavigate } from "react-router-dom";
import { useWeather } from "@/entities/weather/useWeather";
import { useForecast } from "@/entities/weather/useForecast";
import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";

export const WeatherDetail = () => {
  const { lat, lon } = useParams<{ lat: string; lon: string }>();
  const navigate = useNavigate();
  const { favorites, add, remove } = useFavoritesStore();

  const latitude = parseFloat(lat || "0");
  const longitude = parseFloat(lon || "0");

  const { data: currentWeather, isLoading: weatherLoading } = useWeather(
    latitude,
    longitude
  );
  const { data: forecast, isLoading: forecastLoading } = useForecast(
    latitude,
    longitude
  );

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
        name: currentWeather?.name || "알 수 없음",
        lat: latitude,
        lon: longitude,
      });
    }
  };

  if (weatherLoading || forecastLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }

  if (!currentWeather || !forecast) {
    return (
      <div className="flex items-center justify-center h-screen">
        날씨 정보를 불러올 수 없습니다.
      </div>
    );
  }

  // 오늘의 시간대별 날씨 (24시간)
  const todayForecasts = forecast.list.slice(0, 8);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            ← 뒤로 가기
          </button>
          <h1 className="text-2xl font-bold">{currentWeather.name}</h1>
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
              <p className="text-5xl font-bold">{currentWeather.main.temp}°C</p>
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">시간대별 날씨 (24시간)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {todayForecasts.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 text-center"
              >
                <p className="font-semibold text-gray-700">
                  {new Date(item.dt * 1000).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                  className="w-16 h-16 mx-auto"
                />
                <p className="text-2xl font-bold">{item.main.temp}°C</p>
                <p className="text-sm text-gray-600">
                  {item.weather[0].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
