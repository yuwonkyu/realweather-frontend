import type { WeatherResponse } from "@/entities/weather/types";

type CurrentWeatherProps = {
  weather: WeatherResponse;
};

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-5xl font-bold">{weather.main.temp}°C</p>
          <p className="text-gray-600 mt-2">{weather.weather[0].description}</p>
          <p className="text-sm text-gray-500 mt-2">
            최저: {weather.main.temp_min}°C / 최고: {weather.main.temp_max}°C
          </p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
          alt={weather.weather[0].description}
          className="w-32 h-32"
        />
      </div>
    </div>
  );
};
