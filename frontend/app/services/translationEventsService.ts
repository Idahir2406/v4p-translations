import { apiGet, apiPost } from "~/lib/api";
import { objectToQueryString } from "~/lib/utils";

export interface TranslationEvent {
  id: number;
  table_name: string;
  field: string;
  new_value: string;
  identifier: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetTranslationEventsDto {
  status?: string;
}

export const translationEventsService = {
  findAll: async (dto?: GetTranslationEventsDto): Promise<TranslationEvent[]> => {
    const queryString = objectToQueryString(dto ?? {});
    const querySuffix = queryString ? `?${queryString}` : "";
    return apiGet<TranslationEvent[]>(`/translation-events${querySuffix}`);
  },

  processPending: async (limit?: number) => {
    const queryString = objectToQueryString({
      limit: limit && limit > 0 ? limit : undefined,
    });
    const querySuffix = queryString ? `?${queryString}` : "";
    return apiPost<{
      message: string;
      processedEvents: number;
      translatedRows: number;
      errors: number;
    }>(`/translation-events/process${querySuffix}`, {});
  },
};