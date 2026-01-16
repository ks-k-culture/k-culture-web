export const GRADIENT_OVERLAYS = {
  DARK_TO_TRANSPARENT: "bg-gradient-to-t from-black/80 via-transparent to-transparent",
  DARK_FULL: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
  GOLD: "bg-gradient-to-r from-gold/20 to-gold/10",
} as const;

export const SPINNER = {
  SMALL: "w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin",
  MEDIUM: "w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin",
  LARGE: "w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin",
} as const;

export const ICON_SIZES = {
  XS: "w-4 h-4",
  SM: "w-5 h-5",
  MD: "w-6 h-6",
  LG: "w-8 h-8",
  XL: "w-12 h-12",
} as const;

export const ASPECT_RATIOS = {
  SQUARE: "aspect-square",
  PORTRAIT: "aspect-3/4",
  VIDEO: "aspect-video",
} as const;

export const PROJECT_STATUS_STYLES = {
  기획중: {
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  진행중: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "text-blue-400",
    dot: "bg-blue-400",
  },
  캐스팅완료: {
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: "text-green-400",
    dot: "bg-green-400",
  },
} as const;

export type ProjectStatus = keyof typeof PROJECT_STATUS_STYLES;

export function getProjectStatusStyle(status: string) {
  return PROJECT_STATUS_STYLES[status as ProjectStatus] || PROJECT_STATUS_STYLES.진행중;
}

export const JOB_CATEGORY_STYLES = {
  단편영화: "text-green-400 border-green-400/20 bg-green-400/10",
  장편영화: "text-gold border-gold/20 bg-gold/10",
  웹드라마: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  광고: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
  뮤직비디오: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  기타: "text-muted-gray border-muted-gray/20 bg-muted-gray/10",
} as const;

export type JobCategory = keyof typeof JOB_CATEGORY_STYLES;

export function getJobCategoryStyle(category: string): string {
  return JOB_CATEGORY_STYLES[category as JobCategory] || JOB_CATEGORY_STYLES.기타;
}

export const JOB_STATUS_STYLES = {
  모집중: "text-green-400 border-green-400/20 bg-green-400/10",
  마감됨: "text-muted-gray border-muted-gray/20 bg-muted-gray/10",
} as const;

export type JobStatus = keyof typeof JOB_STATUS_STYLES;

export function getJobStatusStyle(status: string): string {
  return JOB_STATUS_STYLES[status as JobStatus] || JOB_STATUS_STYLES.마감됨;
}