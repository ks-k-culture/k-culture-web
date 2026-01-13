/**
 * Orval용 커스텀 fetch mutator
 * - 자동 토큰 주입
 * - 401 시 자동 토큰 갱신
 * - JSON 직렬화/역직렬화
 * - 에러 핸들링
 */

import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface CustomFetchConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  responseType?: "json" | "blob" | "text";
}

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return Cookies.get("accessToken") || null;
};

const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  Cookies.set("accessToken", token, {
    expires: 1,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

const clearAccessToken = (): void => {
  if (typeof window === "undefined") return;
  Cookies.remove("accessToken", { path: "/" });
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        clearAccessToken();
        Cookies.remove("userType", { path: "/" });

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken || data.data?.accessToken;

      if (newAccessToken) {
        setAccessToken(newAccessToken);
        return newAccessToken;
      }

      return null;
    } catch {
      clearAccessToken();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const executeFetch = async (
  config: CustomFetchConfig,
  token: string | null
): Promise<Response> => {
  const { url, method, params, data, headers, signal } = config;

  const queryString = params
    ? "?" +
    new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    ).toString()
    : "";

  const fullUrl = `${BASE_URL}${url}${queryString}`;

  const isFormData = data instanceof FormData;

  const requestHeaders: Record<string, string> = {};

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (headers) {
    const headersObj =
      headers instanceof Headers
        ? Object.fromEntries(headers.entries())
        : (headers as Record<string, string>);

    for (const [key, value] of Object.entries(headersObj)) {
      if (isFormData && key.toLowerCase() === "content-type") {
        continue;
      }
      requestHeaders[key] = value;
    }
  }

  return fetch(fullUrl, {
    method,
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    signal,
    headers: requestHeaders,
    credentials: "include",
  });
};

export const customFetch = async <T>({
  url,
  method,
  params,
  data,
  headers,
  signal,
  responseType = "json",
}: CustomFetchConfig): Promise<T> => {
  const token = getAccessToken();

  let response = await executeFetch(
    { url, method, params, data, headers, signal, responseType },
    token
  );

  if (response.status === 401) {
    if (!url.includes("/auth/refresh") && !url.includes("/auth/login")) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        response = await executeFetch(
          { url, method, params, data, headers, signal, responseType },
          newToken
        );
      } else {
        const error = new Error("인증이 만료되었습니다. 다시 로그인해주세요.") as Error & {
          status: number;
          code: string;
        };
        error.status = 401;
        error.code = "TOKEN_EXPIRED";
        throw error;
      }
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({
      error: { message: `HTTP Error: ${response.status}` },
    }));

    const error = new Error(
      errorBody?.error?.message || errorBody?.message || `HTTP Error: ${response.status}`
    ) as Error & {
      status: number;
      code: string;
    };
    error.status = response.status;
    error.code = errorBody?.error?.code || "UNKNOWN";
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  if (responseType === "blob") {
    return response.blob() as Promise<T>;
  }

  if (responseType === "text") {
    return response.text() as Promise<T>;
  }

  return response.json();
};

export default customFetch;

export type ErrorType<T> = T;
export type BodyType<T> = T;
