import { useEffect, useRef } from "react";

interface Props {
  lat: number;
  lon: number;
}

export const KakaoMap = ({ lat, lon }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.load) return;
    if (!mapRef.current) return;

    window.kakao.maps.load(() => {
      const kakao = window.kakao;
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

  return <div ref={mapRef} className="w-full h-auto rounded-lg" />;
};
