import { useFavoritesStore } from "../model/favoritesStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onResetHome: () => void;
}

export const FavoriteSidebar = ({ open, setOpen, onResetHome }: Props) => {
  const { favorites, rename } = useFavoritesStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
    setError("");
  };

  const handleSaveEdit = (id: string) => {
    const trimmedValue = editValue.trim();

    // 입력 검증
    if (!trimmedValue) {
      setError("이름을 입력해주세요");
      return;
    }

    if (trimmedValue.length > 30) {
      setError("이름은 30자 이하로 입력해주세요");
      return;
    }

    rename(id, trimmedValue);
    setEditingId(null);
    setEditValue("");
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setError("");
  };

  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!open) return;
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragOffset(0);
  };

  // 드래그 중
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - dragStartX;

    // 왼쪽으로만 드래그 가능 (음수 값만)
    if (offset < 0) {
      setDragOffset(offset);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // 100px 이상 왼쪽으로 드래그하면 닫기
    if (dragOffset < -100) {
      setOpen(false);
    }

    setDragOffset(0);
  };

  return (
    <aside
      ref={sidebarRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      className={`fixed top-0 left-0 h-screen bg-zinc-900 text-white shadow-xl overflow-y-auto transition-all duration-300 ${
        open ? "w-80" : "w-0"
      } z-40 ${isDragging ? "transition-none" : ""}`}
      style={{
        transform:
          isDragging && dragOffset < 0
            ? `translateX(${dragOffset}px)`
            : undefined,
        cursor: isDragging ? "grabbing" : "grab",
      }}
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
                  <div key={f.id} className="relative group">
                    {editingId === f.id ? (
                      // 편집 모드
                      <div className="px-3 py-2 bg-zinc-800 rounded-md">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(f.id);
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                          maxLength={30}
                          className="w-full bg-zinc-700 text-white text-sm px-2 py-1 rounded border border-zinc-600 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                        {error && (
                          <p className="text-xs text-red-400 mt-1">{error}</p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => handleSaveEdit(f.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-zinc-600 hover:bg-zinc-500 text-white text-xs px-2 py-1 rounded transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 일반 모드
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigate(`/weather/${f.lat}/${f.lon}`);
                          }}
                          className="flex-1 text-left px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors text-sm"
                        >
                          📍 {f.name}
                        </button>
                        <button
                          onClick={() => handleStartEdit(f.id, f.name)}
                          className="p-2 rounded-md bg-zinc-700 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors"
                          aria-label="이름 수정"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
