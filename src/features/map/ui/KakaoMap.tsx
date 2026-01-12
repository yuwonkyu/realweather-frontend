import { useEffect, useRef } from "react";

interface Props {
  lat: number;
  lon: number;
}

export const KakaoMap = ({ lat, lon }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !window.kakao) return;

    const kakao = window.kakao;

    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(lat, lon);

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });

      new kakao.maps.Marker({
        map,
        position: center,
      });
    });
  }, [lat, lon]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg" />;
};
