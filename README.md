# 🌦️ RealWeather - 실시간 날씨 정보 앱

실시간 날씨 정보를 제공하고 즐겨찾기 관리 기능을 갖춘 반응형 웹 애플리케이션입니다.

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [주요 기능 상세](#-주요-기능-상세)
- [환경 변수](#-환경-변수)

## ✨ 주요 기능

### 1. 실시간 날씨 정보

- 현재 위치 기반 자동 날씨 표시
- 현재 기온, 최저/최고 기온
- 시간대별 날씨 (3시간 간격, 24시간)
- 5일간 날씨 예보
- 상세 정보 (체감온도, 습도, 풍속, 풍향, 기압, 가시거리, 구름, 강수량)
- 일출/일몰 시간

### 2. 장소 검색

- Kakao 장소 검색 API 통합
- 주요 도시 즉시 검색 (서울, 부산, 대구, 인천 등)
- 20,000+ 한국 행정구역 검색 지원
- 키보드 탐색 (방향키, Enter, Escape)
- 검색 결과 자동 스크롤

### 3. 즐겨찾기 관리

- 최대 6개 장소 저장
- 카드 형태 UI (실시간 날씨 표시)
- 즐겨찾기 이름 수정 (최대 20자)
- localStorage를 통한 영구 저장
- 반응형 그리드 레이아웃 (1/2/3열)

### 4. 사이드바

- 노션 스타일 토글 사이드바 (320px)
- 부드러운 애니메이션 (transform 기반)
- 드래그로 닫기 기능 (100px 이상 왼쪽으로 드래그)
- 즐겨찾기 목록 및 인라인 편집

### 5. 반응형 디자인

- 모바일 (< 768px): 1열 레이아웃, 햄버거 메뉴
- 태블릿 (768px ~ 1024px): 2열 레이아웃, 사이드바 토글
- 데스크톱 (> 1024px): 3열 레이아웃, 최적화된 UI

### 6. UX 개선

- 한글 주소 표시 (카카오 역지오코딩)
- 로딩 스피너 및 에러 핸들링
- 위치 권한 거부 시 기본 위치 제공 (서울)
- API 실패 시 재시도 UI
- 페이지 전환 애니메이션 (framer-motion)
- 긴 이름 말줄임 처리 및 툴팁

## 🛠 기술 스택

### Frontend

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **TanStack Query (React Query)** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Tailwind CSS 4** - 스타일링
- **framer-motion** - 애니메이션

### APIs

- **OpenWeather API** - 날씨 데이터
- **Kakao Maps API** - 장소 검색 및 지오코딩

### Dev Tools

- **pnpm** - 패키지 매니저
- **ESLint** - 코드 품질
- **PostCSS** - CSS 처리

## 🚀 시작하기

### 필수 조건

- Node.js 18 이상
- pnpm 8 이상

### 설치

1. 저장소 클론

```bash
git clone <repository-url>
cd realweather
```

2. 의존성 설치

```bash
pnpm install
```

3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_KAKAO_API_KEY=your_kakao_javascript_key
```

> **API 키 발급 방법:**
>
> - OpenWeather API: https://openweathermap.org/api
> - Kakao Maps API: https://developers.kakao.com/

4. 개발 서버 실행

```bash
pnpm dev
```

5. 브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과물 미리보기
pnpm preview
```

## 📁 프로젝트 구조

```
src/
├── app/                    # 앱 설정 및 라우팅
│   ├── App.tsx            # 메인 앱 컴포넌트
│   ├── Layout.tsx         # 레이아웃 (사이드바 + 콘텐츠)
│   ├── router.tsx         # 라우터 설정
│   └── loadKakao.ts       # 카카오 API 로더
├── assets/                # 정적 자산
├── entities/              # 비즈니스 엔티티
│   ├── location/          # 위치 관련 로직
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── useReverseGeocode.ts
│   │   └── useKakaoSearch.ts
│   └── weather/           # 날씨 관련 로직
│       ├── api.ts
│       ├── types.ts
│       ├── useWeather.ts
│       └── useForecast.ts
├── features/              # 기능별 모듈
│   ├── favorites/         # 즐겨찾기 기능
│   │   ├── model/
│   │   │   └── favoritesStore.ts  # Zustand 스토어
│   │   └── ui/
│   │       ├── FavoriteSidebar.tsx
│   │       └── FavoritesList.tsx
│   ├── map/              # 지도 관련
│   │   └── ui/
│   │       └── KakaoMap.tsx
│   └── search/           # 검색 기능
│       └── components/
│           └── KakaoSearchBox.tsx
├── pages/                # 페이지 컴포넌트
│   ├── Home/
│   │   └── index.tsx     # 홈 페이지
│   └── WeatherDetail/
│       └── index.tsx     # 날씨 상세 페이지
├── shared/               # 공유 리소스
│   ├── api/
│   │   └── axios.ts      # Axios 인스턴스
│   ├── constants/
│   │   └── korea_districts.json  # 한국 행정구역 데이터
│   ├── ui/               # 공유 UI 컴포넌c트
│   │   └── PageTransition.tsx  # 페이지 전환 애니메이션
│   └── utils/            # 유틸리티 함수
└── types/                # 타입 정의
    └── kakao.d.ts        # Kakao API 타입
```

## 🎯 주요 기능 상세

### 즐겨찾기 관리

```typescript
// Zustand 스토어 사용 예시
const { favorites, add, remove, rename } = useFavoritesStore();

// 즐겨찾기 추가
add({
  id: Date.now().toString(),
  name: "서울",
  lat: 37.5665,
  lon: 126.978,
});

// 이름 변경
rename(favoriteId, "새 이름");

// 삭제
remove(favoriteId);
```

### 날씨 데이터 가져오기

```typescript
// React Query를 사용한 데이터 페칭
const { data, isLoading, error } = useWeather(lat, lon);

// 5일 예보
const { data: forecast } = useForecast(lat, lon);
```

### 장소 검색

```typescript
// Kakao 검색
const { results, search } = useKakaoSearch();
search("강남역");

// 역지오코딩 (좌표 → 주소)
const { address } = useReverseGeocode(lat, lon);
```

## 🔐 환경 변수

| 변수                       | 설명                | 필수 |
| -------------------------- | ------------------- | ---- |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API 키  | ✅   |
| `VITE_KAKAO_API_KEY`       | Kakao JavaScript 키 | ✅   |

## 📱 반응형 브레이크포인트

- **Mobile**: < 768px
- **Tablet**: 768px ~ 1024px
- **Desktop**: > 1024px

## 🎨 디자인 특징

- **색상 테마**: 회색 톤 (zinc) + 파란색 액센트
- **애니메이션**: `transition-all duration-300`
- **그림자**: Tailwind shadow 유틸리티
- **아이콘**: SVG 기반 커스텀 아이콘

## 🐛 문제 해결

### 위치 권한 거부

- 브라우저 설정에서 위치 권한을 허용해주세요
- 거부 시 서울의 날씨가 기본으로 표시됩니다

### API 오류

- `.env` 파일에 올바른 API 키가 설정되어 있는지 확인하세요
- OpenWeather API는 무료 플랜 기준 60 calls/minute 제한이 있습니다

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📄 라이선스

MIT License

## 👨‍💻 개발자

리얼티쓰 프론트엔드 채용과제

---

**Made with ❤️ using React + TypeScript + Vite**
