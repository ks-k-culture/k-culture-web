interface FetcherOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * Orval용 커스텀 fetch 함수
 * - 자동 토큰 주입
 * - JSON 직렬화/역직렬화
 * - 에러 핸들링
 */
export const customFetch = async <T>(
  url: string,
  options?: FetcherOptions
): Promise<T> => {
  const { body, ...fetchOptions } = options || {};

  // 토큰 가져오기 (클라이언트에서만)
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

  const response = await fetch(url, {
    ...fetchOptions,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions?.headers,
    },
  });

  // 에러 응답 처리
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: { message: `HTTP Error: ${response.status}` },
    }));
    throw new Error(error?.error?.message || `HTTP Error: ${response.status}`);
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

export default customFetch;

