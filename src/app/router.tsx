import { createBrowserRouter } from "react-router-dom";
import { Home } from "@/pages/Home";
import { WeatherDetail } from "@/pages/WeatherDetail";
import { Layout } from "../app/Layout";
import App from "./App";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/weather/:lat/:lon",
            element: <WeatherDetail />,
          },
        ],
      },
    ],
  },
]);
