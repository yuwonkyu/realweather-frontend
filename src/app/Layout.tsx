import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FavoriteSidebar } from "../features/favorites/ui/FavoriteSidebar";

export const Layout = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  return (
    <>
      <Outlet context={{ coords, setCoords }} />
      <FavoriteSidebar onSelect={() => {}} />
    </>
  );
};
