import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Favorite {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface FavoritesStore {
  favorites: Favorite[];
  add: (favorite: Favorite) => void;
  remove: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],
      add: (fav) =>
        set((state) => ({
          favorites: [...state.favorites, fav],
        })),
      remove: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        })),
    }),
    {
      name: "favorites-storage",
    }
  )
);
