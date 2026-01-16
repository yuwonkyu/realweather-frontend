type LocationErrorBannerProps = {
  error: string;
  onRetry: () => void;
};

export const LocationErrorBanner = ({
  error,
  onRetry,
}: LocationErrorBannerProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <span className="text-yellow-600 text-xl">⚠️</span>
        <div className="flex-1">
          <p className="text-yellow-800 font-medium">{error}</p>
          <p className="text-yellow-700 text-sm mt-1">
            현재 서울의 날씨를 표시하고 있습니다.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="text-yellow-600 hover:text-yellow-800 font-medium text-sm"
        >
          재시도
        </button>
      </div>
    </div>
  );
};
