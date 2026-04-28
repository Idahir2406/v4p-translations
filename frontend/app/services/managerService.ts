import { apiDelete, apiGet, apiPatch, apiPost } from "~/lib/api";
import type { TranslationTable } from "./translationsService";

export interface ClienteTranslation {
  id: number;
  table_name: string;
  lang: string;
  field: string;
  value: string;
  identifier: string;
}

export interface ManagerResponse {
  translationTable: TranslationTable;
  clienteTranslations: ClienteTranslation[];
}

export interface FilterOptionsResponse {
  translationTable: TranslationTable;
  fields: string[];
  langs: string[];
  totalTranslations: number;
}

export interface GetTranslationsParams {
  id: string;
  lang?: string;
  field?: string;
}

export const managerService = {
  getFilterOptions: async (id: string): Promise<FilterOptionsResponse> => {
    return apiGet<FilterOptionsResponse>(`/manager/${id}/filter-options`);
  },

  getTranslations: async (
    params: GetTranslationsParams
  ): Promise<ManagerResponse> => {
    return apiPost<ManagerResponse>("/manager/get-translations", params);
  },

  updateTranslation: async (
    id: number,
    value: string
  ): Promise<ClienteTranslation> => {
    return apiPatch<ClienteTranslation>(`/manager/translation/${id}`, {
      value,
    });
  },

  deleteTranslation: async (id: number): Promise<ClienteTranslation> => {
    return apiDelete<ClienteTranslation>(`/manager/translation/${id}`);
  },
};
