import { apiGet } from "~/lib/api";


export interface Language {
  id: string;
  code: string;
  name: string;
}

export const languajesService = {
  getAll: async (): Promise<Language[]> => {
    const url = `/languages`;
    return apiGet<Language[]>(url);
  },
}