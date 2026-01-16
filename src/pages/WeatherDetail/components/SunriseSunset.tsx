type SunriseSunsetProps = {
  sunrise: number;
  sunset: number;
};

export const SunriseSunset = ({ sunrise, sunset }: SunriseSunsetProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">일출/일몰</h2>
      <div className="flex justify-around items-center">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">일출</p>
          <p className="text-2xl font-semibold text-gray-800">
            {new Date(sunrise * 1000).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-4xl text-gray-300">→</div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">일몰</p>
          <p className="text-2xl font-semibold text-gray-800">
            {new Date(sunset * 1000).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
