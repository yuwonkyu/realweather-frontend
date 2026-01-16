import { useState, useEffect } from "react";

export const useReverseGeocode = (lat: number, lon: number) => {
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon || !window.kakao) return;

    setIsLoading(true);
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.coord2Address(lon, lat, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        if (result[0]) {
          const addr = result[0].address;
          // 시/도 + 시/군/구 형식으로 표시
          const locationName = `${addr.region_1depth_name} ${addr.region_2depth_name}`;
          setAddress(locationName);
        }
      }
      setIsLoading(false);
    });
  }, [lat, lon]);

  return { address, isLoading };
};
