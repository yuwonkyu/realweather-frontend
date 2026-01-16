# 코드 리팩토링 및 최적화 트러블슈팅

이 문서는 프로젝트 리팩토링 및 최적화 과정에서 발생한 문제와 해결 방법을 기록합니다.

## 📅 작성일: 2026년 1월 16일

---

## 1. 코드 가독성 및 유지보수성 문제

### 문제 상황

- WeatherDetail 페이지: 447줄의 긴 코드로 가독성 저하
- Home 페이지: 267줄의 반복적인 JSX 코드
- 조건부 className에 템플릿 리터럴 사용으로 복잡성 증가
- 로딩/에러 UI가 각 페이지마다 중복

### 해결 방법

#### 1.1 컴포넌트 분리

**WeatherDetail 페이지 (447줄 → 206줄, 54% 감소)**

```
components/
├── CurrentWeather.tsx       - 현재 날씨
├── HourlyForecast.tsx       - 시간대별 날씨
├── DailyForecast.tsx        - 5일간 예보
├── SunriseSunset.tsx        - 일출/일몰
├── WeatherDetails.tsx       - 상세 정보
└── PrecipitationInfo.tsx    - 강수 정보
```

**Home 페이지 (267줄 → 134줄, 50% 감소)**

```
components/
├── LocationErrorBanner.tsx   - 위치 에러 배너
├── CurrentWeatherCard.tsx    - 현재 날씨 카드
└── HourlyForecastSection.tsx - 시간대별 날씨 섹션
```

#### 1.2 공통 UI 컴포넌트 생성

```
shared/ui/
├── Loading.tsx        - 재사용 가능한 로딩 컴포넌트
└── ErrorDisplay.tsx   - 재사용 가능한 에러 컴포넌트
```

#### 1.3 조건부 className 관리 개선

**Before:**

```tsx
className={`flex items-center ${sidebarOpen ? "invisible" : "visible"}`}
```

**After:**

```tsx
// shared/utils/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 사용
className={cn("flex items-center", sidebarOpen && "invisible")}
```

### 결과

- 코드 가독성 향상
- 컴포넌트 재사용성 증가
- 유지보수 비용 감소
- Tailwind CSS 클래스 충돌 자동 해결

---

## 2. TypeScript 타입 안정성 문제

### 2.1 Kakao Maps API `any` 타입 사용

#### 문제 상황

```typescript
// kakao.d.ts (Before)
declare global {
  interface Window {
    kakao: any; // ESLint 경고 발생
  }
}
```

#### 해결 방법

Kakao Maps API의 타입을 명확하게 정의:

```typescript
// kakao.d.ts (After)
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (result: Array<{...}>, status: string) => void
            ) => void;
          };
          Geocoder: new () => {
            coord2Address: (
              x: number,
              y: number,
              callback: (result: Array<{...}>, status: string) => void
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
```

#### 결과

- ESLint `no-explicit-any` 경고 해결
- IDE 자동완성 지원
- 타입 안정성 확보
- 런타임 에러 사전 방지

### 2.2 `verbatimModuleSyntax` 에러

#### 문제 상황

```typescript
// 컴포넌트에서
import { WeatherResponse } from "@/entities/weather/types";
// 에러: 'WeatherResponse'은(는) 형식이며 'verbatimModuleSyntax'를 사용하도록 설정한 경우
// 형식 전용 가져오기를 사용하여 가져와야 합니다.
```

#### 해결 방법

```typescript
// type import 사용
import type { WeatherResponse } from "@/entities/weather/types";
import type { ForecastItem } from "@/entities/weather/types";
```

#### 결과

- TypeScript 컴파일 에러 해결
- 타입과 값을 명확히 구분
- 번들 크기 최적화 (타입은 런타임에서 제거됨)

---

## 3. 성능 최적화

### 3.1 React Query 캐싱 전략

#### 문제 상황

- API 호출이 과도하게 발생
- 동일한 데이터를 반복적으로 요청
- 네트워크 비용 증가

#### 해결 방법

```typescript
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
      gcTime: 10 * 60 * 1000, // 10분 후 가비지 컬렉션
      retry: 1, // 실패 시 1번만 재시도
      refetchOnWindowFocus: false, // 창 포커스 시 자동 갱신 비활성화
    },
  },
});
```

#### 결과

- API 호출 횟수 감소
- 사용자 경험 향상 (빠른 응답)
- 네트워크 비용 절감

### 3.2 컴포넌트 메모이제이션

#### 해결 방법

```typescript
// React.memo로 불필요한 리렌더링 방지
const FavoriteCard = memo(({ id, name, lat, lon, onSelect, onRemove }) => {
  // ...
});

// useCallback으로 함수 메모이제이션
const handleSearchSelect = useCallback(
  (lat: number, lon: number, name: string) => {
    navigate(`/weather/${lat}/${lon}?name=${encodeURIComponent(name)}`);
  },
  [navigate]
);

// useMemo로 계산 결과 메모이제이션
const filteredResults = useMemo(() => {
  return MAJOR_CITIES.filter((city) => city.name.includes(searchTerm));
}, [searchTerm]);
```

#### 결과

- 렌더링 성능 향상
- 불필요한 계산 방지
- 메모리 사용 최적화

---

## 4. SEO 및 웹 표준

### 4.1 SEO 최적화 부족

#### 문제 상황

- 기본 `<title>`만 존재
- 메타 태그 부재
- SNS 공유 시 미리보기 없음
- 파비콘 누락

#### 해결 방법

```html
<!-- index.html -->
<head>
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/opengraph.png" />

  <!-- SEO Meta Tags -->
  <meta name="description" content="실시간 날씨 정보를 제공하는..." />
  <meta name="keywords" content="날씨, 실시간 날씨, 날씨 예보..." />
  <meta name="theme-color" content="#3b82f6" />

  <!-- Open Graph -->
  <meta property="og:title" content="RealWeather - 실시간 날씨 정보" />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="/opengraph.png" />
  <meta property="og:url" content="https://realweather-frontend.vercel.app/" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="RealWeather - 실시간 날씨 정보" />

  <title>RealWeather - 실시간 날씨 정보</title>
</head>
```

#### 결과

- 검색 엔진 노출 개선
- SNS 공유 시 풍부한 미리보기
- 브랜드 아이덴티티 강화
- iOS 홈 화면 추가 지원

---

## 5. 불필요한 코드 제거

### 5.1 미사용 파일 및 컴포넌트

#### 삭제된 파일들

```
삭제:
- src/features/map/ui/KakaoMap.tsx (지도 표시 기능 미사용)
- src/pages/PlaceDetail/index.tsx (레거시 페이지)
- src/features/search/components/SearchBox.tsx (대체됨)
- src/features/search/utils.ts (사용되지 않음)
- src/entities/location/useGeocode.ts (대체됨)
- src/assets/react.svg (사용되지 않는 asset)
```

#### 이유

- Kakao Maps API는 검색과 역지오코딩만 사용
- 지도 표시 기능 불필요
- 레거시 코드 정리

#### 결과

- 번들 크기 감소
- 코드베이스 단순화
- 유지보수 포인트 감소

### 5.2 불필요한 주석 제거

#### Before

```tsx
{
  /* 헤더 */
}
<div className="flex items-center">
  {/* 현재 온도와 날씨 아이콘 */}
  <div className="flex">
    {/* 날씨 설명 */}
    <p className="text-sm">맑음</p>
  </div>
</div>;
```

#### After

```tsx
<div className="flex items-center">
  <div className="flex">
    <p className="text-sm">맑음</p>
  </div>
</div>
```

#### 결과

- 코드 가독성 향상
- 자명한 주석 제거
- 코드만으로 의도 전달

---

## 6. SVG 아이콘 관리

### 6.1 인라인 SVG의 문제

#### 문제 상황

```tsx
// 여러 곳에서 중복된 SVG 코드
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M6 18L18 6M6 6l12 12"
  />
</svg>
```

#### 해결 방법

SVG를 이미지 파일로 분리:

```tsx
// public/cancel.svg, fix.svg, up.svg, down.svg 생성
<img src="/cancel.svg" alt="삭제" className="size-5" />
<img src="/fix.svg" alt="수정" className="w-4 h-4" />
<img src="/up.svg" alt="최고" className="w-4 h-4" />
<img src="/down.svg" alt="최저" className="w-4 h-4" />
```

#### 결과

- 코드 중복 제거
- 아이콘 관리 용이
- 일관된 스타일 유지
- 번들 크기 감소

---

## 7. 교훈 및 베스트 프랙티스

### 7.1 컴포넌트 설계

- 단일 책임 원칙: 하나의 컴포넌트는 하나의 역할
- 200줄 이상 코드는 분리 검토
- Props 인터페이스 명확히 정의

### 7.2 타입 안정성

- `any` 사용 지양
- 외부 라이브러리 타입 정의 작성
- `type` import로 명확한 구분

### 7.3 성능 최적화

- React Query 캐싱 전략 수립
- 메모이제이션 적절히 활용
- 불필요한 리렌더링 방지

### 7.4 코드 품질

- ESLint 경고 해결
- 불필요한 주석 제거
- 일관된 코딩 스타일 유지

### 7.5 SEO 및 접근성

- 메타 태그 완성도 높이기
- 시맨틱 HTML 사용
- aria-label 적절히 활용

---

## 📊 최종 성과

| 항목                    | Before | After  | 개선율 |
| ----------------------- | ------ | ------ | ------ |
| WeatherDetail 코드 라인 | 447줄  | 206줄  | -54%   |
| Home 코드 라인          | 267줄  | 134줄  | -50%   |
| TypeScript 에러         | 5개    | 0개    | -100%  |
| ESLint 경고             | 3개    | 0개    | -100%  |
| 미사용 파일             | 6개    | 0개    | -100%  |
| 번들 크기               | -      | 최적화 | -      |

---

## 🔗 관련 문서

- [SIDEBAR_IMPLEMENTATION.md](./SIDEBAR_IMPLEMENTATION.md) - 사이드바 구현 트러블슈팅
- [README.md](./README.md) - 프로젝트 개요
- [TODO_CHECKLIST.md](./TODO_CHECKLIST.md) - 기능 체크리스트
