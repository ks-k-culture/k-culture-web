/**
 * 공용 색상 상수
 * 디자인 시스템 기반 색상 정의
 */

export const COLORS = {
  // 텍스트 색상
  text: {
    primary: "#191F28", // 주요 텍스트
    secondary: "#4E5968", // 서브 텍스트
    tertiary: "#6B7684", // 보조 텍스트
    muted: "#8B95A1", // 플레이스홀더, 비활성
    disabled: "#B0B8C1", // 더 연한 텍스트/아이콘
  },

  // 배경 색상
  background: {
    primary: "#FFFFFF", // 기본 배경
    secondary: "#F2F4F6", // 연한 배경
    tertiary: "#E5E8EB", // 더 진한 배경
  },

  // 테두리 색상
  border: {
    default: "#E5E8EB", // 기본 테두리
    light: "#F2F4F6", // 연한 테두리
    dark: "#D1D6DB", // 진한 테두리
  },

  // 액센트 색상
  accent: {
    red: "#E50815", // 강조, 활성
    blue: "#009DFF", // 정보, 완료
  },

  // 상태별 색상
  status: {
    planning: {
      bg: "rgba(78, 89, 104, 0.1)",
      text: "#4E5968",
    },
    ongoing: {
      bg: "rgba(229, 8, 21, 0.1)",
      text: "#E50815",
    },
    completed: {
      bg: "rgba(0, 157, 255, 0.1)",
      text: "#009DFF",
    },
  },
} as const;

// 타입 추출
export type TextColor = (typeof COLORS.text)[keyof typeof COLORS.text];
export type BackgroundColor = (typeof COLORS.background)[keyof typeof COLORS.background];
export type BorderColor = (typeof COLORS.border)[keyof typeof COLORS.border];
export type AccentColor = (typeof COLORS.accent)[keyof typeof COLORS.accent];

