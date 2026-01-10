import { useState } from "react";
import { searchDistricts } from "../utils";

interface Props {
  onSelect: (name: string) => void;
}

export const SearchBox = ({ onSelect }: Props) => {
  const [keyword, setKeyword] = useState("");

  const results = searchDistricts(keyword);

  return (
    <div>
      <input
        placeholder="지역을 입력해주세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {results.length > 0 && (
        <ul>
          {results.map((item) => (
            <li
              key={item.raw}
              onClick={() => {
                onSelect(item.raw);
                setKeyword(item.display);
              }}
            >
              {item.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
