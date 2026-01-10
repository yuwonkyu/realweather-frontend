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
  favorites: [],
  add: (fav) =>
    set((state) => ({
      favorites: [...state.favorites, fav],
    })),
  remove: (name) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.name !== name),
    })),
}));
