import type { ForecastItem } from "@/entities/weather/types";

type HourlyForecastSectionProps = {
  forecasts: ForecastItem[];
};

export const HourlyForecastSection = ({
  forecasts,
}: HourlyForecastSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        시간대별 날씨
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {forecasts.map((item, index) => {
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
  );
};
