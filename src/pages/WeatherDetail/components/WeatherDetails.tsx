import type { WeatherResponse } from "@/entities/weather/types";

type WeatherDetailsProps = {
  weather: WeatherResponse;
};

const getWindDirection = (deg: number) => {
  const directions = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

export const WeatherDetails = ({ weather }: WeatherDetailsProps) => {
  const details = [
    {
      label: "체감 온도",
      value: `${Math.round(weather.main.feels_like)}℃`,
    },
    {
      label: "습도",
      value: `${weather.main.humidity}%`,
    },
    {
      label: "풍속",
      value: `${weather.wind.speed}m/s`,
    },
    {
      label: "풍향",
      value: getWindDirection(weather.wind.deg),
    },
    {
      label: "기압",
      value: `${weather.main.pressure}hPa`,
    },
    {
      label: "가시거리",
      value: `${(weather.visibility / 1000).toFixed(1)}km`,
    },
    {
      label: "구름",
      value: `${weather.clouds.all}%`,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">상세 정보</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {details.map((detail, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
            <p className="text-xl font-semibold text-gray-800">
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
