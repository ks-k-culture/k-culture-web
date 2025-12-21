'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface MSWProviderProps {
  children: ReactNode;
}

/**
 * MSW Provider 컴포넌트
 * 개발 환경에서 MSW를 초기화하고 준비될 때까지 children 렌더링을 지연합니다.
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function initMSW() {
      if (process.env.NODE_ENV === 'development') {
        const { initMocks } = await import('@/src/mocks');
        await initMocks();
      }
      setMswReady(true);
    }

    initMSW();
  }, []);

  // 개발 환경이 아니면 바로 렌더링
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  // MSW가 준비되지 않았으면 로딩 표시
  if (!mswReady) {
    return null;
  }

  return <>{children}</>;
}



