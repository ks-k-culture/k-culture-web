// 연령대 옵션
export const AGE_RANGE_OPTIONS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"] as const;

// 성별 옵션
export const GENDER_OPTIONS = ["남성", "여성", "기타"] as const;

// 역할 유형 옵션
export const ROLE_TYPE_OPTIONS = ["주연", "조연", "단역", "엑스트라", "특별출연"] as const;

// 장르 옵션
export const GENRE_OPTIONS = ["영화", "드라마", "뮤지컬", "연극", "웹드라마", "광고", "기타"] as const;

// 대표 장르 옵션
export const REPRESENTATIVE_GENRE_OPTIONS = ["액션", "로맨스", "코미디", "스릴러", "공포", "SF", "판타지", "드라마"] as const;

// 포지션 옵션
export const POSITION_OPTIONS = ["배우", "모델", "가수", "MC", "기타"] as const;

// 출연료 옵션
export const FEE_OPTIONS = ["협의", "100만원 이하", "100~300만원", "300~500만원", "500만원 이상"] as const;

// 에이전시 전문분야 옵션
export const SPECIALTY_OPTIONS = ["드라마", "영화제작", "광고/CF", "뮤직비디오", "웹드라마", "SF", "스릴러배우전문"] as const;

// 년도 생성 함수
export const generateYears = (count: number = 30, startYear: number = new Date().getFullYear()) =>
  Array.from({ length: count }, (_, i) => startYear - i);

// 타입 추출
export type AgeRange = (typeof AGE_RANGE_OPTIONS)[number];
export type Gender = (typeof GENDER_OPTIONS)[number];
export type RoleType = (typeof ROLE_TYPE_OPTIONS)[number];
export type Genre = (typeof GENRE_OPTIONS)[number];
export type Position = (typeof POSITION_OPTIONS)[number];
export type Fee = (typeof FEE_OPTIONS)[number];

