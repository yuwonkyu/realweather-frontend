import { useFavoritesStore } from "./../model/favoritesStore";

interface Props {
  onSelect: (lat: number, lon: number) => void;
}

export const FavoritesList = ({ onSelect }: Props) => {
  const { favorites, remove } = useFavoritesStore();

  if (favorites.length === 0) return null;

  return (
    <div>
      <h2>즐겨찾기</h2>
      <ul>
        {favorites.map((f) => (
          <li key={f.name}>
            <button onClick={() => onSelect(f.lat, f.lon)}>{f.name}</button>
            <button onClick={() => remove(f.name)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
