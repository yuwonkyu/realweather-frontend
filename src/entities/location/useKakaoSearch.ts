import { useState } from "react";

export interface KakaoPlace {
  place_name: string;
  address_name: string;

  x: string; // longitude
  y: string; // latitude
}

export const useKakaoSearch = () => {
  const [results, setResults] = useState<KakaoPlace[]>([]);

  const search = (keyword: string) => {
    if (!window.kakao || !keyword) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: KakaoPlace[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      }
    });
  };
  return { results, search };
};
