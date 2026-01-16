import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FavoriteSidebar } from "../features/favorites/ui/FavoriteSidebar";

export type LayoutContext = {
  coords: { lat: number; lon: number } | null;
  setCoords: (coords: { lat: number; lon: number } | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const Layout = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <FavoriteSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onResetHome={() => setCoords(null)}
      />
      <div
        className="min-h-screen transition-transform duration-300 w-screen"
        style={{
          transform: sidebarOpen ? "translateX(320px)" : "translateX(0)",
        }}
      >
        <Outlet context={{ coords, setCoords, sidebarOpen, setSidebarOpen }} />
      </div>
    </div>
  );
};
