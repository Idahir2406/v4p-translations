import { API_URL } from "../constants";

const AUTH_TOKEN_KEY = "v4p_access_token";
const JSON_HEADERS = { "Content-Type": "application/json" };

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export const authTokenStorage = {
  get: () => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  },
  set: (token: string) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

const buildHeaders = (includeJsonHeader = false): HeadersInit => {
  const token = authTokenStorage.get();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  if (includeJsonHeader) {
    return { ...JSON_HEADERS, ...authHeaders };
  }

  return authHeaders;
};

const safeJsonParse = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as T;
};

const handleUnauthorized = () => {
  authTokenStorage.clear();

  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const request = async <T>(
  url: string,
  method: HttpMethod,
  data?: unknown
): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers: buildHeaders(Boolean(data)),
    body: data ? JSON.stringify(data) : undefined,
  });

  const parsedResponse = await safeJsonParse<T & { message?: string }>(response);

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }

    throw new Error(parsedResponse?.message ?? "Request failed");
  }

  return parsedResponse as T;
};

export const apiGet = async <T>(url: string): Promise<T> => {
  return request<T>(url, "GET");
};

export const apiPost = async <T>(url: string, data: unknown): Promise<T> => {
  return request<T>(url, "POST", data);
};

export const apiPatch = async <T>(url: string, data: unknown): Promise<T> => {
  return request<T>(url, "PATCH", data);
};

export const apiPut = async <T>(url: string, data: unknown): Promise<T> => {
  return request<T>(url, "PUT", data);
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  return request<T>(url, "DELETE");
};