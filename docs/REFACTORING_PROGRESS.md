# 페이지 리팩토링 진행 상황

## 목표

- 각 페이지를 React Query(클라이언트 페칭)로 변환
- 서버 컴포넌트와 클라이언트 컴포넌트 분리 (나중 SSR/prefetch 대비)

## 컴포넌트 분리 패턴

```
app/[feature]/
├── _components/
│   ├── Icons.tsx           # 공통 아이콘
│   ├── [Feature]Content.tsx  # 목록/메인 클라이언트 컴포넌트
│   ├── [Feature]Form.tsx     # 폼 클라이언트 컴포넌트
│   └── index.ts              # export
├── page.tsx                  # 서버 컴포넌트 (클라이언트 컴포넌트 렌더링만)
└── [subpage]/
    └── page.tsx              # 서버 컴포넌트
```

---

## ✅ 완료된 작업

### 1. `/mypage` 메인 페이지

- `ProfileSection.tsx` - useGetMyProfile
- `FilmographySection.tsx` - useGetMyProfile + useGetActorFilmography
- `SkillsSection.tsx` - (아직 mock 데이터)
- `ShowreelSection.tsx` - useGetMyProfile + useGetActorShowreels

### 2. `/mypage/filmography` 필모그래피 관리

- `_components/FilmographyManageContent.tsx`
  - useGetMyProfile (actorId 조회)
  - useGetActorFilmography (목록 조회)
  - useDeleteFilmography (삭제)
- `_components/FilmographyEditForm.tsx`
  - useGetFilmographyDetail (상세 조회)
  - useUpdateFilmography (수정)
- `_components/Icons.tsx` - 공통 아이콘

### 3. `/mypage/settings` 설정 페이지

- `_components/SettingsContent.tsx`
  - useGetMyProfile (프로필 조회)
  - useGetNotificationSettings (알림 설정 조회)
  - useUpdateNotificationSettings (알림 설정 수정)
- `_components/ProfileEditForm.tsx`
  - useGetMyProfile (프로필 조회)
  - useUpdateMyProfile (프로필 수정)
- `_components/Icons.tsx` - 공통 아이콘

### 4. `/mypage/showreel` 쇼릴 관리

- `_components/ShowreelEditContent.tsx`
  - useGetMyProfile (actorId 조회)
  - useCreateShowreel (쇼릴 생성)
- `_components/Icons.tsx` - 공통 아이콘

### 5. `/mypage/projects` 프로젝트 관리

- `_components/ProjectsContent.tsx`
  - useGetProjects (프로젝트 목록 조회)
- `_components/Icons.tsx` - 공통 아이콘

### 6. `/mypage/projects/new` 프로젝트 생성

- `_components/ProjectCreateForm.tsx`
  - useCreateProject (프로젝트 생성)

### 7. `/mypage/projects/new/characters` 캐릭터 관리

- `_components/CharactersContent.tsx`
  - useGetProjectCharacters (캐릭터 목록 조회)
  - useDeleteCharacter (캐릭터 삭제)
- `_components/CharacterAddForm.tsx`
  - useCreateCharacter (캐릭터 생성)
- `_components/Icons.tsx` - 공통 아이콘

### 8. `/recommend` 추천 페이지

- `_components/RecommendContent.tsx`
  - useGetActors (배우 목록 조회)
  - 필터 기반 검색

### 9. `/actors/[id]` 배우 상세 페이지

- `_components/ActorDetailContent.tsx`
  - useGetActorDetail (배우 상세 조회)
  - useContactActor (배우 연락)
  - useDownloadActorPortfolio (포트폴리오 다운로드)
- `_components/Icons.tsx` - 공통 아이콘

### 10. `/` 메인 페이지

- `_components/OnboardingContent.tsx` - 온보딩 UI

---

## 사용 가능한 API Hooks (src/ 폴더)

| 파일                             | 주요 Hooks                                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/users/users.ts`             | useGetMyProfile, useUpdateMyProfile, useGetNotificationSettings, useUpdateNotificationSettings                    |
| `src/filmography/filmography.ts` | useGetActorFilmography, useGetFilmographyDetail, useCreateFilmography, useUpdateFilmography, useDeleteFilmography |
| `src/showreels/showreels.ts`     | useGetActorShowreels, useCreateShowreel, useDeleteShowreel                                                        |
| `src/projects/projects.ts`       | useGetProjects, useCreateProject, useGetProjectDetail                                                             |
| `src/characters/characters.ts`   | useGetProjectCharacters, useCreateCharacter, useDeleteCharacter                                                   |
| `src/actors/actors.ts`           | useGetActors, useGetActorDetail, useRecommendActors, useContactActor, useDownloadActorPortfolio                   |
| `src/favorites/favorites.ts`     | useGetFavorites, useAddFavorite, useRemoveFavorite                                                                |
| `src/auth/auth.ts`               | useLogin, useSignup, useLogout                                                                                    |

---

## 참고사항

- 모든 API hooks는 orval로 자동 생성됨 (`src/` 폴더)
- 모델 타입은 `src/model/` 폴더에 있음
- MSW mock handlers는 각 `*.msw.ts` 파일에 정의됨
