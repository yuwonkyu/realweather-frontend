type CurrentWeatherCardProps = {
  temp: number;
  description: string;
  location: string;
  tempMin: number;
  tempMax: number;
  icon: string;
  onDetailClick: () => void;
};

export const CurrentWeatherCard = ({
  temp,
  description,
  location,
  tempMin,
  tempMax,
  icon,
  onDetailClick,
}: CurrentWeatherCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-5xl md:text-6xl font-bold text-gray-800">
            {Math.round(temp)}℃
          </p>
          <p className="text-xl text-gray-700 mt-2">{description}</p>
          <p className="text-sm text-gray-500 mt-2">{location}</p>
          <p className="text-sm text-gray-600 mt-1">
            최저 {Math.round(tempMin)}℃ / 최고 {Math.round(tempMax)}℃
          </p>
        </div>
        <div className="shrink-0">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </div>
      </div>
      <button
        onClick={onDetailClick}
        className="mt-4 w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        현재 위치 상세 날씨 보기
      </button>
    </div>
  );
};
