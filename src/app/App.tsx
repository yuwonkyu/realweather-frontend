import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { loadKakaoMap } from "./loadKakao";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadKakaoMap().then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return <div>Loading Kakao Map...</div>;

  return <Outlet />;
}
