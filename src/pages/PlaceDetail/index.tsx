import { useParams } from "react-router-dom";
import { useWeather } from "@/entities/weather/useWeather";
import { useGeocode } from "@/entities/location/useGeocode";
import { useFavoritesStore } from "@/features/favorites/model/favoritesStore";

export const PlaceDetail = () => {
  const { name } = useParams();
  const decoded = decodeURIComponent(name || "");

  const { data: geo } = useGeocode(decoded);
  const { data } = useWeather(geo?.lat || 0, geo?.lon || 0);

  const { favorites, add, remove } = useFavoritesStore();
  const isFavorite = favorites.some((fav) => fav.name === decoded);

  if (!data) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>{decoded.replace(/\+/g, " ")}</h1>
      <p>{data?.main.temp}℃</p>

      <button
        onClick={() => {
          if (isFavorite) {
            remove(decoded);
          } else {
            add({
              name: decoded,
              lat: geo?.lat,
              lon: geo?.lon,
            });
          }
        }}
      >
        {isFavorite ? "즐겨찾기 삭제" : "즐겨찾기 추가"}
      </button>
    </div>
  );
};
