import { apiDelete, apiGet, apiPatch, apiPost } from "~/lib/api";

export interface TranslationTable {
  id: string;
  table_name: string;
  columns: string[];
  identifier: string | null;
  field_name: string | null;
}

export interface CreateTranslationTablePayload {
  table_name: string;
  columns: string[];
  identifier?: string;
  field_name?: string;
}

export interface UpdateTranslationTablePayload {
  table_name?: string;
  columns?: string[];
  identifier?: string;
  field_name?: string;
}

const BASE = "/translation-tables";

export const translationsService = {
  getAll: async (): Promise<TranslationTable[]> => {
    return apiGet<TranslationTable[]>(BASE);
  },

  getById: async (id: string): Promise<TranslationTable> => {
    return apiGet<TranslationTable>(`${BASE}/${id}`);
  },

  create: async (data: CreateTranslationTablePayload): Promise<TranslationTable> => {
    return apiPost<TranslationTable>(BASE, data);
  },

  update: async (id: string, data: UpdateTranslationTablePayload): Promise<TranslationTable> => {
    return apiPatch<TranslationTable>(`${BASE}/${id}`, data);
  },

  remove: async (id: string): Promise<{ deleted: boolean }> => {
    return apiDelete<{ deleted: boolean }>(`${BASE}/${id}`);
  },
};