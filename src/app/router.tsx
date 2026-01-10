import { createBrowserRouter } from "react-router-dom";
import { Home } from "@/pages/Home";
import { PlaceDetail } from "@/pages/PlaceDetail";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/place/:name", element: <PlaceDetail /> },
]);
