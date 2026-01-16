declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (
                result: Array<{
                  place_name: string;
                  address_name: string;
                  road_address_name: string;
                  x: string;
                  y: string;
                }>,
                status: string
              ) => void
            ) => void;
          };
          Geocoder: new () => {
            coord2Address: (
              x: number,
              y: number,
              callback: (
                result: Array<{
                  address: {
                    address_name: string;
                    region_1depth_name: string;
                    region_2depth_name: string;
                    region_3depth_name: string;
                  };
                }>,
                status: string
              ) => void
            ) => void;
          };
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
        };
      };
    };
  }
}
export {};
