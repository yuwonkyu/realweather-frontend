import { memo } from "react";
import { useFavoritesStore } from "./../model/favoritesStore";
import { useWeather } from "../../../entities/weather/useWeather";

interface Props {
  onSelect: (lat: number, lon: number, name: string) => void;
}

interface FavoriteCardProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onSelect: (lat: number, lon: number, name: string) => void;
  onRemove: (id: string) => void;
}

const FavoriteCard = memo(
  ({ id, name, lat, lon, onSelect, onRemove }: FavoriteCardProps) => {
    const { data: weather, isLoading } = useWeather(lat, lon);

    return (
      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
        onClick={() => onSelect(lat, lon, name)}
      >
        <div className="p-4">
          {/* 헤더: 장소 이름과 삭제 버튼 */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
              {name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="삭제"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 날씨 정보 */}
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : weather ? (
            <div className="space-y-3">
              {/* 현재 온도와 날씨 아이콘 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-16 h-16"
                  />
                  <div className="text-4xl font-bold text-gray-900">
                    {Math.round(weather.main.temp)}°
                  </div>
                </div>
              </div>

              {/* 날씨 설명 */}
              <div className="text-sm text-gray-600 capitalize">
                {weather.weather[0].description}
              </div>

              {/* 최저/최고 온도 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-blue-600">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                  </svg>
                  <span>최저: {Math.round(weather.main.temp_min)}°</span>
                </div>
                <div className="flex items-center text-red-600">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                  </svg>
                  <span>최고: {Math.round(weather.main.temp_max)}°</span>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center">
                  <span className="mr-1">💧</span>
                  <span>습도 {weather.main.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">💨</span>
                  <span>풍속 {weather.wind.speed}m/s</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              날씨 정보를 불러올 수 없습니다
            </div>
          )}
        </div>
      </div>
    );
  }
);

export const FavoritesList = ({ onSelect }: Props) => {
  const { favorites, remove } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>즐겨찾기가 없습니다</p>
        <p className="text-sm mt-2">장소를 검색하고 즐겨찾기에 추가해보세요</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">즐겨찾기</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((f) => (
          <FavoriteCard
            key={f.id}
            id={f.id}
            name={f.name}
            lat={f.lat}
            lon={f.lon}
            onSelect={onSelect}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  );
};
