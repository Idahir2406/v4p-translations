import { authTokenStorage, apiPost } from "~/lib/api";

export interface LoginPayload {
  user: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return apiPost<LoginResponse>("/auth/login", payload);
  },
  logout: () => {
    authTokenStorage.clear();
  },
};
