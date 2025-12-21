import { QueryClient } from '@tanstack/react-query';

/**
 * React Query 클라이언트 팩토리
 * - SSR 환경에서 매번 새 인스턴스 생성 방지
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // 5분간 데이터 신선하게 유지
        staleTime: 5 * 60 * 1000,
        // 10분간 캐시 유지
        gcTime: 10 * 60 * 1000,
        // 재시도 1회
        retry: 1,
        // 창 포커스시 자동 리페치 비활성화
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });



