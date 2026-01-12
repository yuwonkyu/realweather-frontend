import { useState } from "react";
import { useFavoritesStore } from "../model/favoritesStore";

interface Props {
  onSelect: (lat: number, lon: number) => void;
}

export const FavoriteSidebar = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(true);
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-zinc-900 text-white transition-all duration-300 z-40 flex flex-col ${
        open ? "w-64" : "w-0"
      }`}
    >
      {/* 사이드바 컨텐츠 */}
      <div className={`flex-1 overflow-y-auto p-4 ${open ? "" : "hidden"}`}>
        <h2 className="text-lg font-bold mb-4">⭐ 즐겨찾기</h2>
        <div className="space-y-2">
          {favorites.map((f) => (
            <div
              key={f.name}
              className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 cursor-pointer transition-colors"
              onClick={() => onSelect(f.lat, f.lon)}
            >
              {f.name}
            </div>
          ))}
        </div>
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-8 top-4 w-8 h-8 bg-zinc-900 text-white rounded-r-lg flex items-center justify-center hover:bg-zinc-700 transition-colors"
      >
        {open ? "◀" : "▶"}
      </button>
    </div>
  );
};
