type LoadingProps = {
  message?: string;
};

export const Loading = ({ message = "로딩 중..." }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <img src="/loading.png" alt="로딩 중" className="size-30" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
