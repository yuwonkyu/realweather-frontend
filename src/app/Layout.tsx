import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FavoriteSidebar } from "../features/favorites/ui/FavoriteSidebar";

export type LayoutContext = {
  coords: { lat: number; lon: number } | null;
  setCoords: (coords: { lat: number; lon: number } | null) => void;
  sidebarOpen: boolean;
};

export const Layout = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <FavoriteSidebar
        onSelect={(lat, lon) => setCoords({ lat, lon })}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Outlet context={{ coords, setCoords, sidebarOpen }} />
      </div>
    </div>
  );
};
