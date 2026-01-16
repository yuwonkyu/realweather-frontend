import { useState, useEffect } from "react";

interface KakaoAddress {
  region_1depth_name: string;
  region_2depth_name: string;
}

interface KakaoGeocoderResult {
  address: KakaoAddress;
}

type KakaoStatus =
  (typeof window.kakao.maps.services.Status)[keyof typeof window.kakao.maps.services.Status];

export const useReverseGeocode = (lat: number, lon: number) => {
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon || !window.kakao) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    // Promise로 감싸서 비동기 처리
    Promise.resolve().then(() => {
      setIsLoading(true);

      geocoder.coord2Address(
        lon,
        lat,
        (result: KakaoGeocoderResult[], status: KakaoStatus) => {
          if (status === window.kakao.maps.services.Status.OK) {
            if (result[0]) {
              const addr = result[0].address;
              // 시/도 + 시/군/구 형식으로 표시
              const locationName = `${addr.region_1depth_name} ${addr.region_2depth_name}`;
              setAddress(locationName);
            }
          }
          setIsLoading(false);
        }
      );
    });
  }, [lat, lon]);

  return { address, isLoading };
};
