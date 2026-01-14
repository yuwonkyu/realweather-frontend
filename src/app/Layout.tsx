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
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onResetHome={() => setCoords(null)}
      />
      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-48" : "ml-12"
        }`}
      >
        <Outlet context={{ coords, setCoords, sidebarOpen }} />
      </div>
    </div>
  );
};
