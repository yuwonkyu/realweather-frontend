import type { ForecastItem } from "@/entities/weather/types";

type PrecipitationInfoProps = {
  forecasts: ForecastItem[];
};

export const PrecipitationInfo = ({ forecasts }: PrecipitationInfoProps) => {
  const precipitationForecasts = forecasts.filter(
    (item) => item.rain || item.snow
  );

  if (precipitationForecasts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">강수 정보</h2>
      <div className="space-y-2">
        {precipitationForecasts.map((item, index) => {
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
  );
};
