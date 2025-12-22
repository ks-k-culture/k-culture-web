/**
 * MSW 초기화 모듈
 * 개발 환경에서만 MSW를 시작합니다.
 */

export async function initMocks() {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 MSW를 사용하지 않음
    return;
  }

  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./browser');

  await worker.start({
    onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 그대로 통과
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });

  console.log('[MSW] Mock Service Worker started');
}




