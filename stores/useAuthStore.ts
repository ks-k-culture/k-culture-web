import Cookies from "js-cookie";
import { create } from "zustand";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_TYPE_KEY = "userType";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 1,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

type UserType = "actor" | "agency" | "admin";

interface AuthState {
  isAuthenticated: boolean;
  userType: UserType | null;
  accessToken: string | null;
  isHydrated: boolean;
  login: (accessToken: string, type: UserType) => void;
  logout: () => void;
  setUserType: (type: UserType) => void;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: false,
  userType: null,
  accessToken: null,
  isHydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;

    const accessToken = Cookies.get(ACCESS_TOKEN_KEY) || null;
    const userType = Cookies.get(USER_TYPE_KEY) as UserType | null;

    set({
      accessToken,
      userType,
      isAuthenticated: !!accessToken,
      isHydrated: true,
    });
  },

  login: (accessToken, type) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
    Cookies.set(USER_TYPE_KEY, type, COOKIE_OPTIONS);

    set({
      isAuthenticated: true,
      userType: type,
      accessToken,
    });
  },

  logout: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_TYPE_KEY, { path: "/" });

    set({
      isAuthenticated: false,
      userType: null,
      accessToken: null,
    });
  },

  setUserType: (type) => {
    Cookies.set(USER_TYPE_KEY, type, COOKIE_OPTIONS);
    set({ userType: type });
  },

  setAccessToken: (accessToken) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
    set({ accessToken });
  },

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    set({ accessToken: null });
  },

  getAccessToken: () => {
    const state = get();
    if (state.accessToken) return state.accessToken;
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  },
}));
