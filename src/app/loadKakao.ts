export const loadKakaoMap = () => {
  return new Promise<void>((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&libraries=services&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };

    document.head.appendChild(script);
  });
};
