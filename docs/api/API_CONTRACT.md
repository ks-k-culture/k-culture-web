# K-Culture Web API 계약서

> **버전**: 1.0.0  
> **최종 수정일**: 2024-12-14  
> **문서 목적**: 백엔드 팀에게 프론트엔드에서 필요한 API 형태를 전달하기 위한 계약 문서

---

## 1. 인증 및 헤더 규칙

### 1.1 인증 방식
- **JWT Bearer Token** 기반 인증
- Access Token 유효기간: **1시간**
- Refresh Token 유효기간: **7일**

### 1.2 헤더 규칙
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
Accept: application/json
```

### 1.3 인증이 필요한 엔드포인트
- `/api/auth/logout`, `/api/auth/account` (로그아웃/탈퇴)
- `/api/actors/profile`, `/api/actors/{id}/contact` (프로필 등록/연락)
- `/api/filmography/**` (필모그래피 CUD)
- `/api/showreels/**` (쇼릴 CUD)
- `/api/projects/**` (프로젝트 CRUD)
- `/api/characters/**` (캐릭터 CRUD)
- `/api/agencies/**` (에이전시 CRUD)
- `/api/users/**` (사용자 설정)
- `/api/favorites/**` (찜 목록)
- `/api/upload/**` (파일 업로드)

---

## 2. 공통 응답 포맷

### 2.1 성공 응답
```json
{
  "success": true,
  "data": { ... }
}
```

### 2.2 실패 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 메시지",
    "details": { ... }
  }
}
```

### 2.3 목록 조회 응답 (페이지네이션 포함)
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 3. 페이지네이션/정렬/필터 규칙

### 3.1 페이지네이션
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `page` | integer | 1 | 페이지 번호 (1부터 시작) |
| `limit` | integer | 10 | 페이지당 항목 수 (최대 50) |

### 3.2 정렬
| 파라미터 | 타입 | 예시 |
|---------|------|------|
| `sortBy` | string | `views_high`, `views_low`, `recent` |

### 3.3 필터
- 각 리소스별 쿼리 파라미터로 필터 적용
- 빈 값 또는 미전달 시 필터 미적용

---

## 4. 에러 코드 표

| HTTP Status | App Code | 의미 |
|-------------|----------|------|
| 400 | `VALIDATION_ERROR` | 입력값 유효성 검사 실패 |
| 400 | `INVALID_FILE_TYPE` | 지원하지 않는 파일 형식 |
| 401 | `UNAUTHORIZED` | 인증 필요 (토큰 없음/만료) |
| 401 | `INVALID_CREDENTIALS` | 이메일/비밀번호 불일치 |
| 401 | `TOKEN_EXPIRED` | 토큰 만료 |
| 403 | `FORBIDDEN` | 접근 권한 없음 |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 409 | `EMAIL_ALREADY_EXISTS` | 이메일 중복 |
| 409 | `DUPLICATE_ENTRY` | 중복 데이터 |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |

---

## 5. 데이터 형식 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| ID | UUID 문자열 | `550e8400-e29b-41d4-a716-446655440000` |
| 날짜/시간 | ISO 8601 | `2024-01-15T10:00:00Z` |
| 금액 | 정수 (원 단위) | `1500000` |
| 이미지/영상 URL | 전체 URL | `https://storage.k-culture.com/...` |

---

## 6. 변경 규칙 (버전 정책)

1. **하위 호환 원칙**: 기존 필드 삭제 또는 타입 변경 금지
2. **추가는 자유**: 새 필드 추가 시 optional로 추가
3. **Breaking Change 시**: 경로 버전업 (`/api/v2/...`)
4. **Deprecation 공지**: 최소 2주 전 공지 후 deprecated 처리

---

## 7. 화면-API 매핑 표

| 화면 (경로) | 필요 API | 설명 |
|------------|---------|------|
| `/` | - | 온보딩 (정적 페이지) |
| `/login` | `POST /api/auth/login` | 로그인 |
| `/signup` | `POST /api/auth/signup` | 회원가입 |
| `/signup/actor` | `POST /api/actors/profile`, `POST /api/upload/image` | 배우 프로필 등록 |
| `/signup/agency` | `POST /api/agencies/profile` | 에이전시 프로필 등록 |
| `/recommend` | `GET /api/actors`, `POST /api/actors/recommend` | AI 배우 추천 |
| `/actors/[id]` | `GET /api/actors/{id}`, `GET /api/actors/{id}/portfolio`, `POST /api/actors/{id}/contact` | 배우 상세 |
| `/mypage` | `GET /api/users/me`, `GET /api/actors/{id}/filmography`, `GET /api/actors/{id}/showreels` | 마이페이지 |
| `/mypage/settings` | `GET /api/users/me`, `GET /api/users/settings/notifications`, `PUT /api/users/settings/notifications`, `POST /api/auth/logout`, `DELETE /api/auth/account` | 설정 |
| `/mypage/settings/profile` | `GET /api/users/me`, `PUT /api/users/profile`, `POST /api/upload/image` | 프로필 수정 |
| `/mypage/filmography` | `GET /api/actors/{id}/filmography`, `DELETE /api/filmography/{id}` | 필모그래피 관리 |
| `/mypage/filmography/edit/[id]` | `GET /api/filmography/{id}`, `PUT /api/filmography/{id}` | 필모그래피 수정 |
| `/mypage/showreel` | `POST /api/showreels`, `POST /api/upload/video` | 쇼릴 편집 |
| `/mypage/projects` | `GET /api/projects`, `POST /api/actors/recommend` | 프로젝트 목록 |
| `/mypage/projects/new` | `POST /api/projects` | 프로젝트 생성 |
| `/mypage/projects/new/characters` | `GET /api/projects/{id}/characters`, `DELETE /api/characters/{id}` | 캐릭터 목록 |
| `/mypage/projects/new/characters/add` | `POST /api/projects/{id}/characters`, `PUT /api/characters/{id}` | 캐릭터 추가/수정 |

---

## 8. 프론트에서 필요한 데이터 형태 강조

### 8.1 배우 목록 (카드 렌더링용)
```typescript
interface ActorCard {
  id: string;
  name: string;
  imageUrl: string;      // 프로필 이미지 URL (필수)
  age: string;           // "20대 중반" 형태의 문자열
  filmography: number;   // 필모그래피 편수
  tags: string[];        // 배우 태그 배열
}
```

### 8.2 배우 상세 (프로필 페이지용)
```typescript
interface ActorDetail {
  id: string;
  name: string;
  birthYear: number;
  filmographyCount: number;
  description: string;        // 한 줄 소개
  profileImage: string;
  skills: string[];           // 스킬 배열
  filmography: FilmographyItem[];
  showreels: ShowreelItem[];
}
```

### 8.3 프로젝트 목록 (카드용)
```typescript
interface ProjectCard {
  id: string;
  thumbnail: string | null;
  company: string;
  title: string;
  status: '기획중' | '진행중' | '캐스팅완료';
  progress: number;           // 0-100 정수
  createdAt: string;          // ISO 8601
}
```

### 8.4 AI 추천 결과
```typescript
interface ActorRecommendation {
  id: string;
  name: string;
  imageUrl: string;
  matchScore: number;         // 0-100 정수
  matchReasons: string[];     // 추천 사유 배열
}
```

---

## 9. 확정이 필요한 질문 5가지

1. **토큰 갱신 정책**: Access Token 만료 시 자동 갱신 vs 수동 갱신? 현재는 `/api/auth/refresh` 수동 호출 방식으로 설계됨

2. **파일 업로드 제한**: 이미지/영상 최대 용량? 현재 명세에 미포함. 제안: 이미지 10MB, 영상 100MB

3. **AI 추천 API 호출 제한**: 분당/일당 호출 제한이 필요한지? 비용 발생 여부에 따라 rate limit 적용 고려

4. **실시간 알림**: 캐스팅 제안 알림을 위한 WebSocket/SSE 연결이 필요한지? 현재는 polling 방식 가정

5. **검색 기능 확장**: 배우 이름으로 직접 검색하는 기능이 필요한지? 현재는 필터 기반만 설계됨

---

## 10. 백엔드 전달 체크리스트

- [ ] `docs/api/openapi.yaml` 검토 및 피드백
- [ ] JWT 토큰 발급/검증 로직 구현
- [ ] 공통 에러 응답 포맷 적용 확인
- [ ] 파일 업로드 저장소 결정 (S3 등)
- [ ] AI 추천 서비스 연동 방식 논의
- [ ] DB 스키마와 API 스키마 매핑 확인
- [ ] 페이지네이션 성능 최적화 (cursor 방식 필요 시 논의)
- [ ] API Rate Limiting 정책 결정
- [ ] CORS 설정 확인 (프론트 도메인 허용)
- [ ] 개발 서버 URL 및 포트 확정 (현재: `http://localhost:3001`)

---

## 부록: 엔드포인트 요약

| 카테고리 | 메서드 | 엔드포인트 | 인증 | operationId |
|----------|--------|------------|------|-------------|
| Auth | POST | `/api/auth/login` | ❌ | login |
| Auth | POST | `/api/auth/signup` | ❌ | signup |
| Auth | POST | `/api/auth/forgot-password` | ❌ | forgotPassword |
| Auth | POST | `/api/auth/logout` | ✅ | logout |
| Auth | DELETE | `/api/auth/account` | ✅ | deleteAccount |
| Auth | POST | `/api/auth/refresh` | ❌ | refreshToken |
| Actors | GET | `/api/actors` | ❌ | getActors |
| Actors | GET | `/api/actors/{id}` | ❌ | getActorDetail |
| Actors | POST | `/api/actors/recommend` | ✅ | recommendActors |
| Actors | POST | `/api/actors/profile` | ✅ | createActorProfile |
| Actors | GET | `/api/actors/{id}/portfolio` | ❌ | downloadActorPortfolio |
| Actors | POST | `/api/actors/{id}/contact` | ✅ | contactActor |
| Filmography | GET | `/api/actors/{id}/filmography` | ❌ | getActorFilmography |
| Filmography | GET | `/api/filmography/{id}` | ❌ | getFilmographyDetail |
| Filmography | POST | `/api/filmography` | ✅ | createFilmography |
| Filmography | PUT | `/api/filmography/{id}` | ✅ | updateFilmography |
| Filmography | DELETE | `/api/filmography/{id}` | ✅ | deleteFilmography |
| Showreels | GET | `/api/actors/{id}/showreels` | ❌ | getActorShowreels |
| Showreels | POST | `/api/showreels` | ✅ | createShowreel |
| Showreels | PUT | `/api/showreels/{id}` | ✅ | updateShowreel |
| Showreels | DELETE | `/api/showreels/{id}` | ✅ | deleteShowreel |
| Projects | GET | `/api/projects` | ✅ | getProjects |
| Projects | GET | `/api/projects/{id}` | ✅ | getProjectDetail |
| Projects | POST | `/api/projects` | ✅ | createProject |
| Projects | PUT | `/api/projects/{id}` | ✅ | updateProject |
| Projects | DELETE | `/api/projects/{id}` | ✅ | deleteProject |
| Characters | GET | `/api/projects/{id}/characters` | ✅ | getProjectCharacters |
| Characters | POST | `/api/projects/{id}/characters` | ✅ | createCharacter |
| Characters | PUT | `/api/characters/{id}` | ✅ | updateCharacter |
| Characters | DELETE | `/api/characters/{id}` | ✅ | deleteCharacter |
| Agencies | POST | `/api/agencies/profile` | ✅ | createAgencyProfile |
| Agencies | PUT | `/api/agencies/profile` | ✅ | updateAgencyProfile |
| Users | GET | `/api/users/me` | ✅ | getMyProfile |
| Users | PUT | `/api/users/profile` | ✅ | updateMyProfile |
| Users | GET | `/api/users/settings/notifications` | ✅ | getNotificationSettings |
| Users | PUT | `/api/users/settings/notifications` | ✅ | updateNotificationSettings |
| Favorites | GET | `/api/favorites` | ✅ | getFavorites |
| Favorites | POST | `/api/favorites` | ✅ | addFavorite |
| Favorites | DELETE | `/api/favorites/{id}` | ✅ | deleteFavorite |
| Upload | POST | `/api/upload/image` | ✅ | uploadImage |
| Upload | POST | `/api/upload/video` | ✅ | uploadVideo |



