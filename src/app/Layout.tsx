import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FavoriteSidebar } from "../features/favorites/ui/FavoriteSidebar";

export type LayoutContext = {
  coords: { lat: number; lon: number } | null;
  setCoords: (coords: { lat: number; lon: number } | null) => void;
};

export const Layout = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  return (
    <div className="flex min-h-screen">
      <Outlet context={{ coords, setCoords }} />
      <FavoriteSidebar onSelect={(lat, lon) => setCoords({ lat, lon })} />
    </div>
  );
};
