type ErrorDisplayProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
};

export const ErrorDisplay = ({
  title = "오류가 발생했습니다",
  message = "잠시 후 다시 시도해주세요.",
  onRetry,
  onBack,
}: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <div className="text-red-500 text-5xl">⚠️</div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 text-center">{message}</p>
      <div className="flex gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            뒤로 가기
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};
