# 🐛 RealWeather 트러블슈팅 가이드

## 📋 개요

RealWeather 프로젝트 개발 과정에서 발생한 주요 문제들과 해결 과정을 정리한 문서입니다.

> **⚠️ 핵심 원인**: 대부분의 초기 이슈는 **Tailwind CSS 4.1 버전 마이그레이션 실패**로 인해 발생했습니다.

## 📚 목차

1. [Tailwind CSS 4.x 마이그레이션 문제](#1-tailwind-css-4x-마이그레이션-문제)
2. [Kakao Map SDK + TypeScript 타입 충돌](#2-kakao-map-sdk--typescript-타입-충돌)
3. [Vercel 배포 환경 빌드 오류](#3-vercel-배포-환경-빌드-오류)
4. [사이드바 레이아웃 구현 문제](#4-사이드바-레이아웃-구현-문제)

---

## 1. Tailwind CSS 4.x 마이그레이션 문제

### 🔴 문제 상황

Tailwind CSS를 v3에서 v4.1로 업그레이드했으나 스타일이 전혀 적용되지 않는 문제가 발생했습니다.

**증상:**

- 모든 Tailwind 클래스(`bg-zinc-900`, `w-64`, `ml-16` 등)가 작동하지 않음
- 개발자 도구에서 computed styles 확인 시 스타일이 전혀 적용되지 않음
- 컴포넌트는 올바르게 렌더링되지만 시각적 피드백이 전혀 없음

**근본 원인:**

```css
/* ❌ Tailwind CSS v3 방식 (구버전) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Tailwind CSS 4.x에서는 `@tailwind` 디렉티브가 deprecated되어 작동하지 않습니다.

### ✅ 해결 방법

```css
/* ✅ Tailwind CSS v4.x 방식 (신버전) */
@import "tailwindcss";
```

**변경 파일:**

- `src/index.css`

**결과:**

- 모든 Tailwind 유틸리티 클래스가 정상 작동
- 한 줄로 모든 Tailwind 기능 로드

### 💡 교훈

1. **메이저 버전 업그레이드 시 Breaking Changes 확인 필수**
   - 공식 문서의 [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) 숙지
   - CHANGELOG 확인

2. **CSS 문제 우선 디버깅**
   - 컴포넌트 로직보다 먼저 CSS가 적용되는지 확인
   - 개발자 도구 → Computed Styles 확인
   - 간단한 인라인 스타일로 테스트

3. **시각적 피드백 없을 때 근본 원인 추적**
   - UI가 보이지 않을 때는 CSS/빌드 설정 문제일 가능성이 높음
   - 컴포넌트 구조는 올바르나 스타일이 적용되지 않는 경우 설정 파일 확인

---

## 2. Kakao Map SDK + TypeScript 타입 충돌

### 🔴 문제 상황

Kakao Maps SDK를 사용할 때 TypeScript 타입 오류가 발생했습니다.

**증상:**

```typescript
// ❌ TypeScript 에러 발생
window.kakao.maps.load(() => { ... })
// Property 'kakao' does not exist on type 'Window & typeof globalThis'

const ps = new window.kakao.maps.services.Places();
// Cannot find namespace 'kakao'
```

**근본 원인:**

- Kakao Maps SDK는 JavaScript로 작성되어 TypeScript 타입 정의가 없음
- `window.kakao` 객체에 대한 타입 선언이 없어 TypeScript가 인식하지 못함
- 빌드 시 타입 체크 오류로 인한 빌드 실패

### ✅ 해결 방법

**1단계: 전역 타입 선언 파일 생성** (`src/types/kakao.d.ts`)

```typescript
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        services: {
          /* Places, Geocoder, Status 타입 정의 */
        };
      };
    };
  }
}
export {};
```

**2단계: 안전한 SDK 로딩** (`src/app/loadKakao.ts`)

```typescript
export const loadKakaoMap = () => {
  return new Promise<void>((resolve) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&libraries=services`;
    script.onload = () => window.kakao.maps.load(() => resolve());
    document.head.appendChild(script);
  });
};
```

**3단계: 타입 안전한 사용**

```typescript
const search = (keyword: string) => {
  if (!window.kakao || !keyword) return;
  const ps = new window.kakao.maps.services.Places();
  ps.keywordSearch(keyword, (data, status) => {
    /* ... */
  });
};
```

### 💡 핵심 포인트

1. **전역 타입 확장**
   - `declare global`로 Window 인터페이스 확장
   - 실제 API 구조에 맞게 타입 정의
   - `export {}`로 모듈로 만들기 (필수)

2. **런타임 체크**
   - `window.kakao` 존재 여부 확인
   - SDK 로딩 전/후 상태 체크

3. **Promise 기반 로딩**
   - SDK 로딩을 Promise로 감싸서 async/await 사용 가능
   - 중복 로딩 방지 (이미 로드된 경우 즉시 반환)

### 🎯 장점

- ✅ TypeScript 타입 체크 통과
- ✅ IDE 자동완성 지원
- ✅ 빌드 오류 없이 배포 가능
- ✅ 타입 안전성 확보

---

## 3. Vercel 배포 환경 빌드 오류

### 🔴 문제 상황

로컬 환경에서는 정상 작동하나 Vercel 배포 시 빌드가 실패하는 문제가 발생했습니다.

**증상:**

```bash
# Vercel 빌드 로그
✗ window is not defined
✗ TypeError: Cannot read properties of undefined (reading 'kakao')
```

**근본 원인:**

1. **서버 사이드 렌더링(SSR) 환경 문제**
   - Vercel 빌드는 Node.js 환경에서 실행
   - `window`, `document` 같은 브라우저 전역 객체가 존재하지 않음
   - Kakao SDK는 브라우저 환경에서만 작동

2. **환경 변수 미설정**
   - `.env` 파일은 로컬에만 존재
   - Vercel에 환경 변수를 별도로 설정하지 않음

### ✅ 해결 방법

**핵심: 브라우저 환경 체크 추가**

```typescript
// SDK 로딩 시
if (typeof window === "undefined") {
  reject(new Error("SSR environment"));
  return;
}

// 컴포넌트에서 사용 시
if (typeof window === "undefined") return;
if (!window.kakao || !keyword) return;
```

**Vercel 환경 변수 설정**

1. Vercel 대시보드 → Settings → Environment Variables
2. 환경 변수 추가:
   - `VITE_OPENWEATHER_API_KEY`
   - `VITE_KAKAO_API_KEY`
3. Production, Preview, Development 모두 체크
4. 재배포 (GitHub push 또는 `vercel --prod`)

### 💡 핵심 포인트

1. **SSR 환경 분기 처리**

   ```typescript
   if (typeof window === "undefined") {
     // Node.js 환경 (빌드 타임)
     return;
   }
   // 브라우저 환경 (런타임)
   ```

2. **환경 변수 검증**

   ```typescript
   const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
   if (!apiKey) {
     console.error("API Key is missing!");
     return;
   }
   ```

3. **에러 핸들링**
   - SDK 로드 실패 시 명확한 에러 메시지
   - 사용자에게 에러 상태 표시
   - Sentry 등 모니터링 도구 연동 권장

### 🎯 배포 체크리스트

- [x] `typeof window !== "undefined"` 체크 추가
- [x] Vercel 환경 변수 설정 완료
- [x] SDK 로딩 에러 핸들링
- [x] 빌드 성공 확인
- [x] 배포 후 실제 동작 테스트

---

## 4. 사이드바 레이아웃 구현 문제

### 🎯 목표

- 닫힘: 64px (아이콘만) / 열림: 256px (메뉴 표시)
- 메인 컨텐츠가 겹치지 않고 부드럽게 이동

### 🔴 문제 1: 사이드바와 메인 컨텐츠 겹침

**증상:** `fixed` 사이드바가 메인 컨텐츠를 가림

**해결 방법:**

```tsx
// src/app/Layout.tsx
<div
  className={`min-h-screen transition-all duration-300 ${
    sidebarOpen ? "ml-64" : "ml-16"
  }`}
>
  <Outlet context={{ coords, setCoords, sidebarOpen }} />
</div>
```

- 메인 컨텐츠 컨테이너에 동적 마진(`ml-64` / `ml-16`) 적용
- 사이드바 상태에 따라 자동으로 여백 조정
- `fixed` 사이드바 + 동적 마진으로 겹침 방지

### 🔴 문제 2: 너비와 마진 불일치

**증상:** 사이드바 너비(`w-48`)와 마진(`ml-48`)이 미세하게 어긋남

**해결:** 정확히 일치하는 Tailwind 클래스 사용

- 사이드바: `w-64` / `w-16`
- 레이아웃: `ml-64` / `ml-16`

### 🔴 문제 3: 컴포넌트 스타일 충돌

**증상:** Layout과 Home에서 `min-h-screen`을 중복 적용하여 스크롤 문제 발생

**해결 방법:**

```tsx
// ❌ Before - src/pages/Home/index.tsx
<div className="min-h-screen p-6 bg-gray-50">
  {/* ... */}
</div>

// ✅ After - src/pages/Home/index.tsx
<div className="p-6 bg-gray-50">
  {/* ... */}
</div>
```

**레이아웃 책임 분리:**

- **Layout**: `min-h-screen`, 마진 관리
- **Page 컴포넌트**: 패딩, 배경색만 관리
- 높이와 마진은 상위 컴포넌트에서 일관되게 처리

---

## 📁 주요 파일 구조

```
src/
├── app/
│   ├── App.tsx               # Kakao SDK 로딩 및 초기화
│   ├── Layout.tsx            # 사이드바 상태 관리 및 마진 적용
│   └── loadKakao.ts          # Kakao SDK 로더 (브라우저 환경 체크)
├── types/
│   └── kakao.d.ts            # Kakao Maps API 전역 타입 선언
├── entities/
│   └── location/
│       ├── useKakaoSearch.ts      # 장소 검색 (타입 안전)
│       └── useReverseGeocode.ts   # 역지오코딩
├── features/
│   └── favorites/
│       ├── model/
│       │   └── favoritesStore.ts  # Zustand 스토어
│       └── ui/
│           └── FavoriteSidebar.tsx  # 사이드바 컴포넌트
└── pages/
    └── Home/
        └── index.tsx         # 메인 페이지 (마진 충돌 해결)
```

---

## 🎨 스타일 가이드

### 사이드바 크기

| 상태 | Tailwind 클래스 | 픽셀  |
| ---- | --------------- | ----- |
| 열림 | `w-64`          | 256px |
| 닫힘 | `w-16`          | 64px  |

### 레이아웃 마진

| 사이드바 상태 | Tailwind 클래스 | 픽셀  |
| ------------- | --------------- | ----- |
| 열림          | `ml-64`         | 256px |
| 닫힘          | `ml-16`         | 64px  |

### 색상 테마

- **배경**: `bg-zinc-900` (#18181b)
- **텍스트**: `text-white` (#ffffff)
- **호버**: `hover:bg-zinc-800` (#27272a)
- **액센트**: `text-blue-500` (#3b82f6)

### 애니메이션

```css
transition-all duration-300
```

- 부드러운 전환 효과 (300ms)
- 너비, 마진, 변형 등 모든 속성에 적용

---

## 🔑 핵심 포인트 정리

### 1. Tailwind CSS 4.x

- ✅ `@import "tailwindcss"` 방식 사용
- ❌ `@tailwind` 디렉티브는 deprecated

### 2. Kakao Maps SDK + TypeScript

- ✅ `src/types/kakao.d.ts`에 전역 타입 선언
- ✅ `declare global`로 Window 인터페이스 확장
- ✅ `export {}`로 모듈화

### 3. Vercel 배포

- ✅ `typeof window !== "undefined"` 체크
- ✅ Vercel 환경 변수 설정
- ✅ SDK 로딩 에러 핸들링

### 4. 사이드바 레이아웃

- ✅ Fixed 사이드바 + 동적 마진
- ✅ 픽셀 단위 일치 (`w-64` = `ml-64`)
- ✅ Layout에서 높이/마진, Page에서 패딩/배경 관리

---

## ⚠️ 앞으로 주의할 점

### 1. Breaking Changes 사전 확인

메이저 버전 업그레이드 시 공식 문서의 [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)와 CHANGELOG를 **반드시** 먼저 확인해야 합니다. Tailwind CSS 4.x의 `@tailwind` 디렉티브 deprecation을 사전에 알았다면 많은 시간을 절약할 수 있었습니다.

### 2. 체계적인 디버깅 순서

문제 발생 시 다음 순서로 점검해야 합니다:

1. **CSS/스타일** - 개발자 도구에서 스타일 적용 여부 확인
2. **브라우저 환경** - `typeof window` 체크, 콘솔 에러 확인
3. **타입 시스템** - TypeScript 에러 메시지 정독
4. **컴포넌트 로직** - Props 흐름, 상태 관리

시각적 피드백이 없을 때는 컴포넌트 로직보다 **CSS/빌드 설정 문제**일 가능성이 높습니다.

### 3. 일관성 유지

- 사이드바 너비와 마진은 **픽셀 단위까지 정확히 일치**시켜야 합니다
- Tailwind 클래스는 동일한 값을 사용 (`w-64` = `ml-64`)
- 레이아웃 책임을 명확히 분리 (Layout: 높이/마진, Page: 패딩/배경)

### 4. 환경별 분기 처리

배포 환경(Vercel, Netlify 등)에서는 SSR 빌드를 고려해야 합니다:

- `typeof window !== "undefined"` 체크 필수
- 환경 변수는 배포 플랫폼에 별도 설정
- SDK 로딩 실패 시 명확한 에러 메시지 제공

---

## 🚀 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

---

## 📚 참고 자료

### 공식 문서

- [Tailwind CSS 4.0 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Kakao Maps API Docs](https://apis.map.kakao.com/web/)

### 관련 문서

- [React Router Outlet Context](https://reactrouter.com/en/main/hooks/use-outlet-context)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**마지막 업데이트**: 2026년 1월 21일
