import { create } from "zustand";

interface Favorite {
  name: string;
  lat: number;
  lon: number;
}

interface FavoritesStore {
  favorites: Favorite[];
  add: (favorite: Favorite) => void;
  remove: (name: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favorites: [
    { name: "서울", lat: 37.5665, lon: 126.978 },
    { name: "부산", lat: 35.1796, lon: 129.0756 },
    { name: "제주", lat: 33.4996, lon: 126.5312 },
    { name: "강릉", lat: 37.7519, lon: 128.876 },
    { name: "인천", lat: 37.4563, lon: 126.7052 },
  ],
  add: (fav) =>
    set((state) => ({
      favorites: [...state.favorites, fav],
    })),
  remove: (name) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.name !== name),
    })),
}));
