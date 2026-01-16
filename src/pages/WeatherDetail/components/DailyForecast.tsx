import type { ForecastItem } from "@/entities/weather/types";

type DailyForecastProps = {
  forecasts: ForecastItem[];
};

export const DailyForecast = ({ forecasts }: DailyForecastProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">5일간 예보</h2>
      <div className="space-y-3">
        {forecasts.map((item, index) => {
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
                {/* 데스크톱: 막대 그래프 포함 */}
                <div className="hidden md:flex items-center gap-2">
                  <p className="text-sm text-gray-500 w-10 text-right">
                    {Math.round(item.main.temp_min)}°
                  </p>
                  <div className="w-16 h-2 bg-gradient-to-r from-blue-300 to-red-300 rounded"></div>
                  <p className="text-sm font-semibold text-gray-800 w-10 text-left">
                    {Math.round(item.main.temp_max)}°
                  </p>
                </div>
                {/* 모바일: 간략한 텍스트 */}
                <div className="md:hidden">
                  <p className="text-sm text-gray-700">
                    {Math.round(item.main.temp_min)}° /{" "}
                    {Math.round(item.main.temp_max)}°
                  </p>
                </div>
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
  );
};
