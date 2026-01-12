import { useState } from "react";
// import { useFavoritesStore } from "../model/favoritesStore";

interface Props {
  onSelect: (lat: number, lon: number) => void;
}

export const FavoriteSidebar = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(true);
  const favorites = [
    { name: "서울", lat: 37.5665, lon: 126.978 },
    { name: "부산", lat: 35.1796, lon: 129.0756 },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-zinc-900 text-white transition-all duration-300 z-50 flex ${
        open ? "w-64" : "w-0"
      }`}
    >
      {/* 토글 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-4 ml-2 h-10 w-8 rounded-md bg-zinc-800 text-white hover:bg-zinc-700"
        aria-label="즐겨찾기 사이드바 토글"
      >
        {open ? "◀" : "▶"}
      </button>
      {/* 사이드바 컨텐츠 */}
      <div
        className={[
          "ml-2 h-full overflow-hidden bg-zinc-900 text-white",
          "transition-all duration-300",
          open ? "w-72" : "w-0",
        ].join(" ")}
      >
        <h2 className="text-lg font-bold p-4">⭐ 즐겨찾기</h2>
        <div className="space-y-2 px-2">
          {favorites.map((f) => (
            <button
              key={f.name}
              onClick={() => onSelect(f.lat, f.lon)}
              className="px-3 py-2 rounded-md hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
