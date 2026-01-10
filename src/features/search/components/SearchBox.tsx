import { useState } from "react";
import { searchDistricts } from "../utils";
import { useNavigate } from "react-router-dom";

export const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

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
                navigate(`/place/${encodeURIComponent(item.raw)}`);
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
