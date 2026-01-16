import { useFavoritesStore } from "../model/favoritesStore";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onResetHome: () => void;
}

export const FavoriteSidebar = ({ open, setOpen, onResetHome }: Props) => {
  const { favorites } = useFavoritesStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-zinc-900 text-white shadow-xl overflow-y-auto transition-all duration-300 ${
        open ? "w-48" : "w-0"
      } z-40`}
    >
      {/* 토글 버튼 - 사이드바 열렸을 때만 표시 */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="mt-4 ml-auto mr-4 h-10 w-10 rounded-md bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
          aria-label="사이드바 닫기"
        >
          <img src="/close.svg" alt="닫기" className="size-6" />
        </button>
      )}

      {/* 사이드바 컨텐츠 - open일 때만 표시 */}
      {open && (
        <div className="pt-4 px-3">
          {/* 홈 메뉴 */}
          <button
            onClick={() => {
              onResetHome();
              navigate("/");
            }}
            className={`w-full text-left px-3 py-2 rounded-md hover:bg-zinc-700 cursor-pointer transition-colors mb-2 ${
              location.pathname === "/" ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            🏠 홈 - 현재위치
          </button>

          {/* 즐겨찾기 섹션 */}
          <div className="mt-4">
            <div className="px-3 py-2 text-sm text-gray-400 font-medium">
              ⭐ 즐겨찾기
            </div>
            {favorites.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 italic">
                즐겨찾기가 없습니다
              </div>
            ) : (
              <div className="space-y-1 mt-2">
                {favorites.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      navigate(`/weather/${f.lat}/${f.lon}`);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors text-sm"
                  >
                    📍 {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
