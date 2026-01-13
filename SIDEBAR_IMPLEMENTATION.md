# 사이드바 구현 및 문제 해결 가이드

## 📋 구현 개요

노션 스타일의 토글 가능한 사이드바를 구현하면서 발생한 문제들과 해결 과정을 정리한 문서입니다.

## 🎯 최종 결과

- **닫혔을 때**: 64px 얇은 바에 아이콘만 표시
- **열렸을 때**: 256px로 확장되며 홈과 즐겨찾기 메뉴 표시
- 메인 컨텐츠가 사이드바와 겹치지 않고 부드럽게 이동

## 🐛 발생한 문제들과 해결 방법

### 1. 사이드바와 메인 컨텐츠 겹침 문제

**문제점:**

- `FavoriteSidebar`가 `fixed` 포지션으로 설정되어 메인 컨텐츠 위에 겹쳐서 표시됨
- 사이드바를 열었을 때 날씨, 검색, 지도 영역을 가림

**해결 방법:**

```tsx
// Layout.tsx
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

### 2. 사이드바 너비와 레이아웃 마진 불일치

**문제점:**

- 사이드바 너비: `w-48` (192px) / `w-10` (40px)
- 레이아웃 마진: `ml-48` (192px) / `ml-10` (40px)
- 픽셀이 정확히 일치하지 않아 UI가 어긋남

**해결 방법:**

```tsx
// FavoriteSidebar.tsx
className={`fixed top-0 left-0 h-screen bg-zinc-900 text-white z-50 shadow-xl overflow-y-auto transition-all duration-300 ${
  open ? "w-64" : "w-16"
}`}

// Layout.tsx
className={`min-h-screen transition-all duration-300 ${
  sidebarOpen ? "ml-64" : "ml-16"
}`}
```

- 사이드바 너비와 레이아웃 마진을 정확히 일치시킴
- `w-64` (256px) / `w-16` (64px)로 통일

### 3. Home 컴포넌트 마진 충돌

**문제점:**

- Layout에서 `ml-64` 적용
- Home에서 다시 `min-h-screen`과 패딩 적용
- 중첩된 스타일로 인해 마진이 제대로 작동하지 않음

**해결 방법:**

```tsx
// Home/index.tsx - Before
<div className="min-h-screen p-6 bg-gray-50">

// Home/index.tsx - After
<div className="p-6 bg-gray-50">
```

- Home 컴포넌트에서 `min-h-screen` 제거
- Layout에서만 높이와 마진 관리

### 4. Tailwind CSS 4.x 마이그레이션

**문제점:**

- Tailwind CSS 4.x 버전으로 업데이트했지만 이전 v3 설정 방식 사용
- `@tailwind` 디렉티브가 새 버전에서 제대로 작동하지 않음

**해결 방법:**

```css
/* src/index.css - Before */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* src/index.css - After */
@import "tailwindcss";
```

- Tailwind CSS 4.x의 새로운 import 방식 적용
- 한 줄로 모든 Tailwind 기능 로드

## 📁 주요 파일 구조

```
src/
├── app/
│   └── Layout.tsx              # 사이드바 상태 관리 및 마진 적용
├── features/
│   └── favorites/
│       ├── model/
│       │   └── favoritesStore.ts  # Zustand 스토어
│       └── ui/
│           └── FavoriteSidebar.tsx  # 사이드바 컴포넌트
└── pages/
    └── Home/
        └── index.tsx           # 메인 페이지
```

## 🎨 스타일 가이드

### 사이드바 크기

- **열림**: `w-64` (256px)
- **닫힘**: `w-16` (64px)

### 레이아웃 마진

- **사이드바 열림**: `ml-64` (256px)
- **사이드바 닫힘**: `ml-16` (64px)

### 색상

- **배경**: `bg-zinc-900`
- **텍스트**: `text-white`
- **호버**: `hover:bg-zinc-800`

### 애니메이션

- `transition-all duration-300` - 부드러운 전환 효과

## 🔑 핵심 포인트

1. **Fixed vs Relative**: 사이드바는 `fixed`, 메인 컨텐츠는 `margin-left`로 공간 확보
2. **일관성**: 사이드바 너비와 마진 값을 정확히 일치시킬 것
3. **상태 관리**: Layout에서 `sidebarOpen` 상태를 관리하고 하위 컴포넌트로 전달
4. **Tailwind 4.x**: `@import "tailwindcss"` 방식 사용

## 💡 문제 해결 과정의 교훈

### 근본 원인 파악의 중요성

**가장 큰 문제점:**

- Tailwind CSS 4.1 버전 마이그레이션이 제대로 적용되지 않아 **시각적 피드백이 없었음**
- `@tailwind` 디렉티브가 작동하지 않아 모든 Tailwind 클래스가 무시됨
- UI가 실제로 렌더링되지 않아 컴포넌트 구조나 로직 문제인지 CSS 문제인지 구분하기 어려웠음

**결과:**

- 기능과 UI 구조를 계속 수정했지만 근본 원인(CSS 설정)을 해결하지 못함
- 코드는 올바르게 작성되었으나 시각적으로 확인할 수 없었음

### 잘된 점

✅ **일관성 있는 마진 처리**

- 사이드바 너비(`w-64`/`w-16`)와 레이아웃 마진(`ml-64`/`ml-16`)을 정확히 맞춤
- 픽셀 단위까지 일치시켜 UI 어긋남 방지

✅ **명확한 상태 관리**

- Layout에서 `sidebarOpen` 상태를 중앙 관리
- Props drilling을 통한 명확한 데이터 흐름

✅ **컴포넌트 구조 설계**

- Layout → FavoriteSidebar → Home으로 이어지는 깔끔한 계층 구조
- Context API를 활용한 효율적인 상태 전달

### 개선이 필요한 점

⚠️ **새 버전 문서 숙지 부족**

- Tailwind CSS 4.x의 breaking changes를 사전에 확인하지 못함
- `@tailwind` → `@import "tailwindcss"` 변경 사항을 몰랐음

⚠️ **디버깅 순서**

1. ✅ 먼저 CSS가 제대로 적용되는지 확인 (개발자 도구, computed styles)
2. ✅ 기본 스타일이 작동하면 컴포넌트 로직 확인
3. ❌ CSS 문제를 먼저 해결하지 않고 컴포넌트를 계속 수정함

### 다음 프로젝트를 위한 체크리스트

- [ ] 주요 라이브러리 버전 업데이트 시 공식 문서의 Migration Guide 확인
- [ ] CSS 프레임워크 설정이 올바른지 먼저 검증 (간단한 클래스로 테스트)
- [ ] 시각적 문제 발생 시: 스타일 → 구조 → 로직 순서로 디버깅
- [ ] 개발자 도구로 적용된 스타일 확인 (Computed Styles, Network 탭)
- [ ] Breaking changes가 있는 메이저 버전 업데이트는 신중하게 진행

## 🚀 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 📚 참고 자료

- [Tailwind CSS 4.0 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [React Router Outlet Context](https://reactrouter.com/en/main/hooks/use-outlet-context)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
