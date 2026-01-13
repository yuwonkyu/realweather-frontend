import { useFavoritesStore } from "../model/favoritesStore";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  onSelect: (lat: number, lon: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const FavoriteSidebar = ({ onSelect, open, setOpen }: Props) => {
  const { favorites } = useFavoritesStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-zinc-900 text-white z-50 shadow-xl overflow-y-auto transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* 토글 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className={`mt-4 h-10 w-10 rounded-md bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors ${
          open ? "ml-auto mr-4" : "mx-auto"
        }`}
        aria-label="사이드바 토글"
      >
        {open ? (
          <img src="/close.svg" alt="닫기" className="size-6" />
        ) : (
          <img src="/favorite.svg" alt="메뉴" className="size-6" />
        )}
      </button>

      {/* 사이드바 컨텐츠 - open일 때만 표시 */}
      {open && (
        <div className="pt-4 px-3">
          {/* 홈 메뉴 */}
          <button
            onClick={() => navigate("/")}
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
                    key={f.name}
                    onClick={() => {
                      onSelect(f.lat, f.lon);
                      navigate("/");
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
