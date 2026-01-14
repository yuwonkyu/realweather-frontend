import { useState } from "react";
import { useKakaoSearch } from "@/entities/location/useKakaoSearch";

interface Props {
  onSelect: (lat: number, lon: number, name: string) => void;
}

export const KakaoSearchBox = ({ onSelect }: Props) => {
  const [keyword, setKeyword] = useState("");
  const { results, search } = useKakaoSearch();

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          search(e.target.value);
        }}
        placeholder="장소를 검색하세요"
        className="w-full p-2 border border-gray-300 rounded"
      />

      {results.length > 0 && (
        <ul>
          {results.slice(0, 10).map((p) => (
            <li
              key={p.x + p.y}
              onClick={() =>
                onSelect(parseFloat(p.y), parseFloat(p.x), p.place_name)
              }
            >
              {p.place_name} - {p.address_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
