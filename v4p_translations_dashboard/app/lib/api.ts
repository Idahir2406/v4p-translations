import { API_URL } from "../constants";

const headers = { "Content-Type": "application/json" };

export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`);
  return response.json();
};

export const apiPost = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
};

export const apiPatch = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
};

export const apiPut = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
  });
  return response.json();
};