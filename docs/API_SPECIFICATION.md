# K-Culture Web API 명세서

> 현재 목데이터로 구현된 페이지들을 실제 API로 전환하기 위한 API 명세서

---

## 목차

1. [인증 API](#1-인증-api)
2. [배우 API](#2-배우-api)
3. [필모그래피 API](#3-필모그래피-api)
4. [쇼릴(대표영상) API](#4-쇼릴대표영상-api)
5. [프로젝트 API](#5-프로젝트-api)
6. [캐릭터 API](#6-캐릭터-api)
7. [에이전시 API](#7-에이전시-api)
8. [사용자 설정 API](#8-사용자-설정-api)
9. [찜 목록 API](#9-찜-목록-api)
10. [파일 업로드 API](#10-파일-업로드-api)

---

## 1. 인증 API

### 1.1 로그인

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "김배우",
      "type": "actor" | "agency",
      "profileImage": "https://..."
    }
  }
}
```

**사용 페이지:** `app/login/page.tsx`

---

### 1.2 회원가입 (이메일/비밀번호)

```
POST /api/auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "type": "actor" | "agency",
  "termsAgreed": true,
  "privacyAgreed": true,
  "marketingAgreed": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "type": "actor"
  }
}
```

**사용 페이지:** `app/signup/page.tsx`

---

### 1.3 비밀번호 찾기

```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "비밀번호 재설정 이메일이 발송되었습니다."
}
```

---

### 1.4 로그아웃

```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true
}
```

**사용 페이지:** `app/mypage/settings/page.tsx`

---

### 1.5 계정 삭제

```
DELETE /api/auth/account
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "계정이 삭제되었습니다."
}
```

**사용 페이지:** `app/mypage/settings/page.tsx`

---

## 2. 배우 API

### 2.1 배우 목록 조회 (검색/필터)

```
GET /api/actors
```

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `actorType` | string | 배우 유형 (movie, drama, musical, theater, cf) |
| `genderAge` | string | 성별/나이대 (10s, 20s, 30s, 40s, 50s) |
| `workType` | string | 출연 작품 유형 (romance, action, comedy, thriller, drama) |
| `sortBy` | string | 정렬 기준 (views_high, views_low, recent) |
| `page` | number | 페이지 번호 |
| `limit` | number | 페이지당 개수 |

**Response:**
```json
{
  "success": true,
  "data": {
    "actors": [
      {
        "id": "actor_1",
        "name": "김배우",
        "imageUrl": "https://...",
        "age": "20대 중반",
        "filmography": 15,
        "tags": ["섬세한연기", "청춘물감정", "카리스마"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

**사용 페이지:** `app/recommend/page.tsx`

---

### 2.2 배우 상세 조회

```
GET /api/actors/{actorId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "actor_1",
    "name": "김배우",
    "birthYear": 1990,
    "filmographyCount": 15,
    "description": "깊은 눈빛으로 서사를 만드는 배우",
    "profileImage": "https://...",
    "skills": ["영어(원어민 수준)", "피아노", "검술", "승마", "와이어 액션", "현대 무용"],
    "filmography": [
      {
        "id": "f1",
        "year": 2023,
        "type": "영화",
        "title": "서울의 밤",
        "role": "주연",
        "character": "강민준",
        "thumbnail": "https://..."
      }
    ],
    "showreels": [
      {
        "id": "s1",
        "title": "2024 Actor Showreel",
        "duration": "3:15",
        "thumbnail": "https://...",
        "videoUrl": "https://..."
      }
    ]
  }
}
```

**사용 페이지:** `app/actors/[id]/page.tsx`

---

### 2.3 AI 배우 추천 조회

```
POST /api/actors/recommend
```

**Request Body:**
```json
{
  "projectId": "project_123",
  "characterId": "char_456",
  "synopsis": "시놉시스 텍스트...",
  "filters": {
    "ageRange": "20대",
    "gender": "남성",
    "roleType": "주연"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendedActors": [
      {
        "id": "actor_1",
        "name": "김배우",
        "imageUrl": "https://...",
        "matchScore": 95,
        "matchReasons": ["청춘물 경험 다수", "캐릭터 유사 연기 이력"]
      }
    ]
  }
}
```

**사용 페이지:** `app/recommend/page.tsx`, `app/mypage/projects/page.tsx`

---

### 2.4 배우 프로필 등록 (배우 회원가입 시)

```
POST /api/actors/profile
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | 활동명 |
| `introduction` | string | 한 줄 소개 |
| `ageGroup` | string | 나이대 (10대, 20대, 30대, 40대, 50대, 60대 이상) |
| `profileImage` | file | 프로필 이미지 |

**Response:**
```json
{
  "success": true,
  "data": {
    "actorId": "actor_123",
    "name": "김배우",
    "profileImageUrl": "https://..."
  }
}
```

**사용 페이지:** `app/signup/actor/page.tsx`

---

### 2.5 배우 포트폴리오 다운로드

```
GET /api/actors/{actorId}/portfolio
```

**Response:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="portfolio_김배우.pdf"
```

**사용 페이지:** `app/actors/[id]/page.tsx`

---

### 2.6 배우에게 연락하기

```
POST /api/actors/{actorId}/contact
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "message": "안녕하세요, 새 프로젝트 캐스팅 관련 연락드립니다.",
  "projectId": "project_123",
  "characterId": "char_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contactId": "contact_789",
    "status": "sent"
  }
}
```

**사용 페이지:** `app/actors/[id]/page.tsx`

---

## 3. 필모그래피 API

### 3.1 필모그래피 목록 조회

```
GET /api/actors/{actorId}/filmography
```

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `year` | number | 연도 필터 |
| `type` | string | 작품 유형 (영화, 드라마, 뮤지컬 등) |

**Response:**
```json
{
  "success": true,
  "data": {
    "filmography": [
      {
        "id": "f1",
        "year": 2023,
        "type": "영화",
        "title": "서울의 밤",
        "role": "주연",
        "character": "강민준",
        "thumbnail": "https://..."
      }
    ]
  }
}
```

**사용 페이지:** `app/mypage/page.tsx`, `app/mypage/filmography/page.tsx`

---

### 3.2 필모그래피 상세 조회

```
GET /api/filmography/{filmographyId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "f1",
    "title": "서울의 밤",
    "year": 2023,
    "genre": "영화",
    "role": "강민준",
    "roleType": "주연",
    "thumbnail": "https://..."
  }
}
```

**사용 페이지:** `app/mypage/filmography/edit/[id]/page.tsx`

---

### 3.3 필모그래피 생성

```
POST /api/filmography
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "title": "서울의 밤",
  "year": 2023,
  "genre": "영화",
  "role": "강민준",
  "roleType": "주연",
  "thumbnail": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "f_new_123",
    "title": "서울의 밤"
  }
}
```

---

### 3.4 필모그래피 수정

```
PUT /api/filmography/{filmographyId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "title": "서울의 밤",
  "year": 2023,
  "genre": "영화",
  "role": "강민준",
  "roleType": "주연"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "f1",
    "title": "서울의 밤"
  }
}
```

**사용 페이지:** `app/mypage/filmography/edit/[id]/page.tsx`

---

### 3.5 필모그래피 삭제

```
DELETE /api/filmography/{filmographyId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "필모그래피가 삭제되었습니다."
}
```

**사용 페이지:** `app/mypage/filmography/page.tsx`

---

## 4. 쇼릴(대표영상) API

### 4.1 쇼릴 목록 조회

```
GET /api/actors/{actorId}/showreels
```

**Response:**
```json
{
  "success": true,
  "data": {
    "showreels": [
      {
        "id": "s1",
        "title": "2024 Actor Showreel",
        "duration": "3:15",
        "thumbnail": "https://...",
        "videoUrl": "https://...",
        "roleType": "주연",
        "workTitle": "서울의 밤",
        "year": 2024,
        "genre": "영화",
        "role": "강민준",
        "representativeGenre": "드라마",
        "tags": ["연기", "액션"]
      }
    ]
  }
}
```

**사용 페이지:** `app/mypage/page.tsx`, `app/mypage/showreel/page.tsx`

---

### 4.2 쇼릴 생성

```
POST /api/showreels
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
| 필드 | 타입 | 설명 |
|------|------|------|
| `videos` | file[] | 영상 파일 (최대 5개, mp4/mov) |
| `roleType` | string | 역할 종류 (주연, 조연, 단역 등) |
| `workTitle` | string | 작품명 |
| `year` | number | 연도 |
| `genre` | string | 장르 |
| `role` | string | 역할명 |
| `representativeGenre` | string | 대표 장르 |
| `tags` | string[] | 태그 목록 |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "s_new_123",
    "title": "2024 Actor Showreel",
    "videoUrls": ["https://..."]
  }
}
```

**사용 페이지:** `app/mypage/showreel/page.tsx`

---

### 4.3 쇼릴 수정

```
PUT /api/showreels/{showreelId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "title": "Updated Showreel",
  "roleType": "주연",
  "workTitle": "서울의 밤",
  "year": 2024,
  "genre": "영화",
  "role": "강민준",
  "representativeGenre": "드라마",
  "tags": ["연기", "액션"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "s1",
    "title": "Updated Showreel"
  }
}
```

---

### 4.4 쇼릴 삭제

```
DELETE /api/showreels/{showreelId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "쇼릴이 삭제되었습니다."
}
```

---

## 5. 프로젝트 API

### 5.1 프로젝트 목록 조회

```
GET /api/projects
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `status` | string | 상태 필터 (all, ongoing, planning, completed) |
| `page` | number | 페이지 번호 |
| `limit` | number | 페이지당 개수 |

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project_1",
        "thumbnail": "https://...",
        "company": "스튜디오 드래곤",
        "title": "킹더랜드 시즌2",
        "status": "진행중",
        "progress": 30,
        "percentage": 30,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

**사용 페이지:** `app/mypage/projects/page.tsx`

---

### 5.2 프로젝트 상세 조회

```
GET /api/projects/{projectId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project_1",
    "projectName": "킹더랜드 시즌2",
    "company": "스튜디오 드래곤",
    "projectType": "드라마",
    "genre": "로맨스",
    "shootingPeriod": "2024.03 ~ 2024.06",
    "roleInfo": "캐스팅 중인 배역 상세 정보...",
    "status": "진행중",
    "characters": [
      {
        "id": "char_1",
        "name": "서은우",
        "gender": "남성",
        "ageRange": "30대",
        "roleType": "주연"
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

---

### 5.3 프로젝트 생성

```
POST /api/projects
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "projectName": "킹더랜드 시즌2",
  "company": "스튜디오 드래곤",
  "projectType": "드라마",
  "genre": "로맨스",
  "shootingPeriod": "2024.03 ~ 2024.06",
  "roleInfo": "캐스팅 중인 배역 상세 정보..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project_new_123",
    "projectName": "킹더랜드 시즌2"
  }
}
```

**사용 페이지:** `app/mypage/projects/new/page.tsx`

---

### 5.4 프로젝트 수정

```
PUT /api/projects/{projectId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "projectName": "킹더랜드 시즌2",
  "company": "스튜디오 드래곤",
  "projectType": "드라마",
  "genre": "로맨스",
  "shootingPeriod": "2024.03 ~ 2024.06",
  "roleInfo": "캐스팅 중인 배역 상세 정보..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project_1",
    "projectName": "킹더랜드 시즌2"
  }
}
```

---

### 5.5 프로젝트 삭제

```
DELETE /api/projects/{projectId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "프로젝트가 삭제되었습니다."
}
```

---

## 6. 캐릭터 API

### 6.1 캐릭터 목록 조회 (프로젝트별)

```
GET /api/projects/{projectId}/characters
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "char_1",
        "name": "서은우",
        "gender": "남성",
        "ageRange": "30대",
        "roleType": "주연",
        "description": "카리스마 있는 CEO",
        "specialTags": ["주연", "신인"],
        "keywords": ["카리스마", "로맨틱"]
      }
    ]
  }
}
```

**사용 페이지:** `app/mypage/projects/new/characters/page.tsx`

---

### 6.2 캐릭터 생성

```
POST /api/projects/{projectId}/characters
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "name": "서은우",
  "gender": "남성",
  "ageRange": "30대",
  "roleType": "주연",
  "description": "카리스마 있는 CEO",
  "specialTags": ["주연"],
  "keywords": ["카리스마", "로맨틱"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "char_new_123",
    "name": "서은우"
  }
}
```

**사용 페이지:** `app/mypage/projects/new/characters/add/page.tsx`

---

### 6.3 캐릭터 수정

```
PUT /api/characters/{characterId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "name": "서은우",
  "gender": "남성",
  "ageRange": "30대",
  "roleType": "주연",
  "description": "카리스마 있는 CEO",
  "specialTags": ["주연"],
  "keywords": ["카리스마", "로맨틱"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "char_1",
    "name": "서은우"
  }
}
```

---

### 6.4 캐릭터 삭제

```
DELETE /api/characters/{characterId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "캐릭터가 삭제되었습니다."
}
```

**사용 페이지:** `app/mypage/projects/new/characters/page.tsx`

---

## 7. 에이전시 API

### 7.1 에이전시 프로필 등록

```
POST /api/agencies/profile
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "agencyName": "스튜디오 드래곤",
  "representativeName": "김대표",
  "foundedYear": "2020",
  "specialties": ["드라마", "영화제작", "광고/CF"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agencyId": "agency_123",
    "agencyName": "스튜디오 드래곤"
  }
}
```

**사용 페이지:** `app/signup/agency/page.tsx`

---

### 7.2 에이전시 프로필 수정

```
PUT /api/agencies/profile
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "agencyName": "스튜디오 드래곤",
  "representativeName": "김대표",
  "foundedYear": "2020",
  "specialties": ["드라마", "영화제작", "광고/CF"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agencyId": "agency_123",
    "agencyName": "스튜디오 드래곤"
  }
}
```

---

## 8. 사용자 설정 API

### 8.1 사용자 정보 조회

```
GET /api/users/me
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@email.com",
    "name": "홍길동",
    "type": "actor",
    "profileImage": "https://...",
    "position": "배우",
    "agency": "소속사 없음",
    "phone": "010-1234-5678",
    "bio": "자기소개...",
    "fee": "협의",
    "height": 175,
    "weight": 65,
    "settings": {
      "castingNotification": true,
      "messageNotification": true,
      "marketingNotification": false
    }
  }
}
```

**사용 페이지:** `app/mypage/settings/page.tsx`, `app/mypage/settings/profile/page.tsx`

---

### 8.2 프로필 수정

```
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | 이름/닉네임 |
| `position` | string | 포지션 (배우, 모델, 가수, MC, 기타) |
| `agency` | string | 소속사 |
| `phone` | string | 연락처 |
| `bio` | string | 자기소개 |
| `fee` | string | 출연료 |
| `height` | number | 키 (cm) |
| `weight` | number | 몸무게 (kg) |
| `profileImage` | file | 프로필 이미지 |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "홍길동",
    "profileImageUrl": "https://..."
  }
}
```

**사용 페이지:** `app/mypage/settings/profile/page.tsx`

---

### 8.3 알림 설정 조회

```
GET /api/users/settings/notifications
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "castingNotification": true,
    "messageNotification": true,
    "marketingNotification": false
  }
}
```

**사용 페이지:** `app/mypage/settings/page.tsx`

---

### 8.4 알림 설정 수정

```
PUT /api/users/settings/notifications
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "castingNotification": true,
  "messageNotification": true,
  "marketingNotification": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "castingNotification": true,
    "messageNotification": true,
    "marketingNotification": false
  }
}
```

**사용 페이지:** `app/mypage/settings/page.tsx`

---

## 9. 찜 목록 API

### 9.1 찜 목록 조회

```
GET /api/favorites
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `type` | string | 타입 (actors, projects) |
| `page` | number | 페이지 번호 |
| `limit` | number | 페이지당 개수 |

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "fav_1",
        "type": "actor",
        "targetId": "actor_123",
        "actor": {
          "id": "actor_123",
          "name": "김배우",
          "imageUrl": "https://...",
          "age": "20대 중반",
          "filmography": 15
        },
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

**사용 페이지:** 찜목록 페이지 (하단 네비게이션에서 연결)

---

### 9.2 찜 추가

```
POST /api/favorites
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "type": "actor",
  "targetId": "actor_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "fav_new_123",
    "type": "actor",
    "targetId": "actor_123"
  }
}
```

---

### 9.3 찜 삭제

```
DELETE /api/favorites/{favoriteId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "찜 목록에서 삭제되었습니다."
}
```

---

## 10. 파일 업로드 API

### 10.1 이미지 업로드

```
POST /api/upload/image
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
| 필드 | 타입 | 설명 |
|------|------|------|
| `file` | file | 이미지 파일 (jpg, png, gif, webp) |
| `type` | string | 업로드 타입 (profile, thumbnail, portfolio) |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/images/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

**사용 페이지:** `app/signup/actor/page.tsx`, `app/mypage/settings/profile/page.tsx`

---

### 10.2 영상 업로드

```
POST /api/upload/video
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
| 필드 | 타입 | 설명 |
|------|------|------|
| `file` | file | 영상 파일 (mp4, mov) |
| `type` | string | 업로드 타입 (showreel) |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/videos/abc123.mp4",
    "thumbnailUrl": "https://storage.example.com/thumbnails/abc123.jpg",
    "filename": "abc123.mp4",
    "size": 15728640,
    "duration": "3:15",
    "mimeType": "video/mp4"
  }
}
```

**사용 페이지:** `app/mypage/showreel/page.tsx`

---

## 공통 에러 응답

모든 API는 에러 발생 시 아래 형식으로 응답합니다:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {}
  }
}
```

### 공통 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| `UNAUTHORIZED` | 401 | 인증 필요 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `VALIDATION_ERROR` | 400 | 유효성 검사 실패 |
| `INTERNAL_ERROR` | 500 | 서버 오류 |

---

## API 엔드포인트 요약

| 카테고리 | 메서드 | 엔드포인트 | 설명 |
|----------|--------|------------|------|
| 인증 | POST | `/api/auth/login` | 로그인 |
| 인증 | POST | `/api/auth/signup` | 회원가입 |
| 인증 | POST | `/api/auth/forgot-password` | 비밀번호 찾기 |
| 인증 | POST | `/api/auth/logout` | 로그아웃 |
| 인증 | DELETE | `/api/auth/account` | 계정 삭제 |
| 배우 | GET | `/api/actors` | 배우 목록 조회 |
| 배우 | GET | `/api/actors/{id}` | 배우 상세 조회 |
| 배우 | POST | `/api/actors/recommend` | AI 배우 추천 |
| 배우 | POST | `/api/actors/profile` | 배우 프로필 등록 |
| 배우 | GET | `/api/actors/{id}/portfolio` | 포트폴리오 다운로드 |
| 배우 | POST | `/api/actors/{id}/contact` | 연락하기 |
| 필모 | GET | `/api/actors/{id}/filmography` | 필모그래피 목록 |
| 필모 | GET | `/api/filmography/{id}` | 필모그래피 상세 |
| 필모 | POST | `/api/filmography` | 필모그래피 생성 |
| 필모 | PUT | `/api/filmography/{id}` | 필모그래피 수정 |
| 필모 | DELETE | `/api/filmography/{id}` | 필모그래피 삭제 |
| 쇼릴 | GET | `/api/actors/{id}/showreels` | 쇼릴 목록 |
| 쇼릴 | POST | `/api/showreels` | 쇼릴 생성 |
| 쇼릴 | PUT | `/api/showreels/{id}` | 쇼릴 수정 |
| 쇼릴 | DELETE | `/api/showreels/{id}` | 쇼릴 삭제 |
| 프로젝트 | GET | `/api/projects` | 프로젝트 목록 |
| 프로젝트 | GET | `/api/projects/{id}` | 프로젝트 상세 |
| 프로젝트 | POST | `/api/projects` | 프로젝트 생성 |
| 프로젝트 | PUT | `/api/projects/{id}` | 프로젝트 수정 |
| 프로젝트 | DELETE | `/api/projects/{id}` | 프로젝트 삭제 |
| 캐릭터 | GET | `/api/projects/{id}/characters` | 캐릭터 목록 |
| 캐릭터 | POST | `/api/projects/{id}/characters` | 캐릭터 생성 |
| 캐릭터 | PUT | `/api/characters/{id}` | 캐릭터 수정 |
| 캐릭터 | DELETE | `/api/characters/{id}` | 캐릭터 삭제 |
| 에이전시 | POST | `/api/agencies/profile` | 에이전시 프로필 등록 |
| 에이전시 | PUT | `/api/agencies/profile` | 에이전시 프로필 수정 |
| 사용자 | GET | `/api/users/me` | 내 정보 조회 |
| 사용자 | PUT | `/api/users/profile` | 프로필 수정 |
| 사용자 | GET | `/api/users/settings/notifications` | 알림 설정 조회 |
| 사용자 | PUT | `/api/users/settings/notifications` | 알림 설정 수정 |
| 찜 | GET | `/api/favorites` | 찜 목록 조회 |
| 찜 | POST | `/api/favorites` | 찜 추가 |
| 찜 | DELETE | `/api/favorites/{id}` | 찜 삭제 |
| 업로드 | POST | `/api/upload/image` | 이미지 업로드 |
| 업로드 | POST | `/api/upload/video` | 영상 업로드 |

---

## 구현 우선순위 제안

### Phase 1: 핵심 기능
1. 인증 API (로그인/회원가입)
2. 배우 프로필 등록/수정
3. 배우 목록/상세 조회

### Phase 2: 프로필 관리
4. 필모그래피 CRUD
5. 쇼릴 CRUD
6. 파일 업로드 (이미지/영상)

### Phase 3: 프로젝트 & 캐스팅
7. 프로젝트 CRUD
8. 캐릭터 CRUD
9. AI 배우 추천

### Phase 4: 부가 기능
10. 찜 목록
11. 연락하기
12. 알림 설정

