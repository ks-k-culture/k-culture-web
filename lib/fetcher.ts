/**
 * Orval용 커스텀 fetch mutator
 * - 자동 토큰 주입
 * - JSON 직렬화/역직렬화
 * - 에러 핸들링
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface CustomFetchConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  responseType?: 'json' | 'blob' | 'text';
}

export const customFetch = async <T>({
  url,
  method,
  params,
  data,
  headers,
  signal,
  responseType = 'json',
}: CustomFetchConfig): Promise<T> => {
  // 토큰 가져오기 (클라이언트에서만)
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

  // URL에 쿼리 파라미터 추가
  const queryString = params
    ? '?' +
    new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    ).toString()
    : '';

  const fullUrl = `${BASE_URL}${url}${queryString}`;

  const isFormData = data instanceof FormData;

  const response = await fetch(fullUrl, {
    method,
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    signal,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
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

  // responseType에 따른 응답 처리
  if (responseType === 'blob') {
    return response.blob() as Promise<T>;
  }

  if (responseType === 'text') {
    return response.text() as Promise<T>;
  }

  return response.json();
};

export default customFetch;

// 타입 export (orval에서 필요)
export type ErrorType<T> = T;
export type BodyType<T> = T;
