import { useState, useMemo, useEffect, useCallback } from "react";
import { useKakaoSearch } from "@/entities/location/useKakaoSearch";
import koreaDistricts from "@/shared/constants/korea_districts.json";

interface Props {
  onSelect: (lat: number, lon: number, name: string) => void;
}

// 주요 도시 목록 (컴포넌트 외부로 이동하여 재생성 방지)
const MAJOR_CITIES = [
  { name: "서울", lat: 37.5665, lon: 126.978 },
  { name: "부산", lat: 35.1796, lon: 129.0756 },
  { name: "대구", lat: 35.8714, lon: 128.6014 },
  { name: "인천", lat: 37.4563, lon: 126.7052 },
  { name: "광주", lat: 35.1595, lon: 126.8526 },
  { name: "대전", lat: 36.3504, lon: 127.3845 },
  { name: "울산", lat: 35.5384, lon: 129.3114 },
  { name: "제주", lat: 33.4996, lon: 126.5312 },
  { name: "세종", lat: 36.48, lon: 127.289 },
] as const;

export const KakaoSearchBox = ({ onSelect }: Props) => {
  const [keyword, setKeyword] = useState("");
  const { results, search } = useKakaoSearch();
  const [waitingForAdminRegion, setWaitingForAdminRegion] = useState<
    string | null
  >(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // 행정구역 데이터 필터링 (모든 레벨 포함)
  const administrativeRegions = useMemo(() => {
    return koreaDistricts.map((region) => {
      // "서울특별시-종로구-청운동" → "청운동" (가장 하위 단위를 표시명으로)
      const parts = region.split("-");
      const displayName = parts[parts.length - 1];
      return {
        fullName: region,
        displayName: displayName,
        searchText: region.replace(/-/g, " "), // 검색용
        level: parts.length, // 행정구역 레벨 (1: 시/도, 2: 구/군, 3: 동/읍/면/리 등)
      };
    });
  }, []);

  // 주요 도시 필터링 (검색어와 시작하는 도시들)
  const filteredCities = useMemo(
    () =>
      keyword
        ? MAJOR_CITIES.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
          )
        : [],
    [keyword]
  );

  // 행정구역 필터링
  const filteredAdminRegions = useMemo(
    () =>
      keyword
        ? administrativeRegions
            .filter(
              (region) =>
                region.searchText
                  .toLowerCase()
                  .includes(keyword.toLowerCase()) ||
                region.displayName.toLowerCase().includes(keyword.toLowerCase())
            )
            .slice(0, 10) // 최대 10개만 표시
        : [],
    [keyword, administrativeRegions]
  );

  // 전체 결과 목록 (방향키 탐색용)
  const allResults = useMemo(
    () => [
      ...filteredCities.map((city) => ({ type: "city" as const, data: city })),
      ...filteredAdminRegions.map((region) => ({
        type: "admin" as const,
        data: region,
      })),
      ...results
        .slice(0, 10)
        .map((place) => ({ type: "place" as const, data: place })),
    ],
    [filteredCities, filteredAdminRegions, results]
  );

  // 결과가 있는지 확인
  const hasResults = useMemo(
    () =>
      keyword &&
      (filteredCities.length > 0 ||
        filteredAdminRegions.length > 0 ||
        results.length > 0),
    [
      keyword,
      filteredCities.length,
      filteredAdminRegions.length,
      results.length,
    ]
  );

  // 행정구역 선택 시 카카오 API로 좌표 검색
  const handleAdminRegionSelect = useCallback(
    (region: (typeof filteredAdminRegions)[0]) => {
      const searchQuery = region.fullName.replace(/-/g, " ");
      setWaitingForAdminRegion(region.displayName);
      search(searchQuery);
    },
    [search]
  );

  const handleSelectFirst = useCallback(() => {
    // 주요 도시명과 정확히 일치하는지 확인
    const matchedCity = MAJOR_CITIES.find(
      (city) => city.name === keyword.trim()
    );

    if (matchedCity) {
      onSelect(matchedCity.lat, matchedCity.lon, matchedCity.name);
      setKeyword("");
    } else if (filteredAdminRegions.length > 0) {
      // 행정구역 첫 번째 항목 선택
      handleAdminRegionSelect(filteredAdminRegions[0]);
    } else if (results.length > 0) {
      // 일반 검색 결과의 첫 번째 항목 사용
      const first = results[0];
      onSelect(parseFloat(first.y), parseFloat(first.x), first.place_name);
      setKeyword("");
    }
  }, [
    keyword,
    filteredAdminRegions,
    results,
    onSelect,
    handleAdminRegionSelect,
  ]);

  // 포커스된 항목 선택
  const selectFocusedItem = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < allResults.length) {
      const item = allResults[focusedIndex];
      if (item.type === "city") {
        onSelect(item.data.lat, item.data.lon, item.data.name);
        setKeyword("");
        setFocusedIndex(-1);
      } else if (item.type === "admin") {
        handleAdminRegionSelect(item.data);
        setFocusedIndex(-1);
      } else {
        onSelect(
          parseFloat(item.data.y),
          parseFloat(item.data.x),
          item.data.place_name
        );
        setKeyword("");
        setFocusedIndex(-1);
      }
    } else {
      // 포커스가 없으면 기존 로직 (첫 번째 항목)
      handleSelectFirst();
    }
  }, [
    focusedIndex,
    allResults,
    onSelect,
    handleAdminRegionSelect,
    handleSelectFirst,
  ]);

  // 행정구역 검색 결과가 나오면 자동으로 첫 번째 항목 선택
  useEffect(() => {
    if (waitingForAdminRegion && results.length > 0) {
      const first = results[0];
      // 비동기로 처리하여 cascading render 방지
      Promise.resolve().then(() => {
        onSelect(
          parseFloat(first.y),
          parseFloat(first.x),
          waitingForAdminRegion
        );
        setKeyword("");
        setWaitingForAdminRegion(null);
      });
    }
  }, [results, waitingForAdminRegion, onSelect]);

  // 포커스된 항목으로 스크롤
  useEffect(() => {
    if (focusedIndex >= 0) {
      const element = document.getElementById(`search-result-${focusedIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [focusedIndex]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            search(e.target.value);
            setFocusedIndex(-1); // 검색어 변경 시 포커스 초기화
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              selectFocusedItem();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setFocusedIndex((prev) =>
                prev < allResults.length - 1 ? prev + 1 : prev
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setFocusedIndex((prev) => (prev > -1 ? prev - 1 : -1));
            } else if (e.key === "Escape") {
              setKeyword("");
              setFocusedIndex(-1);
            }
          }}
          maxLength={30}
          placeholder="장소를 검색하세요"
          className="w-full p-2 pr-10 border border-gray-300 rounded"
        />
        <img
          src="/seach.svg"
          alt="검색"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
        />
      </div>

      {hasResults && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-y-auto z-50">
          {filteredCities.map((city, index) => (
            <li
              id={`search-result-${index}`}
              key={`city-${city.name}`}
              onClick={() => {
                onSelect(city.lat, city.lon, city.name);
                setKeyword("");
                setFocusedIndex(-1);
              }}
              className={`p-3 cursor-pointer border-b border-gray-100 ${
                focusedIndex === index
                  ? "bg-blue-100"
                  : "bg-blue-50/30 hover:bg-blue-50"
              }`}
            >
              <div className="font-medium text-blue-700">{city.name}</div>
              <div className="text-sm text-gray-500">주요 도시 · 전체 날씨</div>
            </li>
          ))}
          {filteredAdminRegions.map((region, index) => {
            const globalIndex = filteredCities.length + index;
            return (
              <li
                id={`search-result-${globalIndex}`}
                key={`admin-${region.fullName}`}
                onClick={() => {
                  handleAdminRegionSelect(region);
                  setFocusedIndex(-1);
                }}
                className={`p-3 cursor-pointer border-b border-gray-100 ${
                  focusedIndex === globalIndex
                    ? "bg-green-100"
                    : "bg-green-50/30 hover:bg-green-50"
                }`}
              >
                <div className="font-medium text-green-700">
                  {region.displayName}
                </div>
                <div className="text-sm text-gray-500">
                  {region.fullName.replace(/-/g, " ")}
                </div>
              </li>
            );
          })}
          {results.slice(0, 10).map((p, index) => {
            const globalIndex =
              filteredCities.length + filteredAdminRegions.length + index;
            return (
              <li
                id={`search-result-${globalIndex}`}
                key={p.x + p.y}
                onClick={() => {
                  onSelect(parseFloat(p.y), parseFloat(p.x), p.place_name);
                  setKeyword("");
                  setFocusedIndex(-1);
                }}
                className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  focusedIndex === globalIndex
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium text-gray-900">{p.place_name}</div>
                <div className="text-sm text-gray-500">{p.address_name}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
