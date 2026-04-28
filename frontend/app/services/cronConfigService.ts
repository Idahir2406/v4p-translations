import { apiGet, apiPatch } from "~/lib/api";

export interface CronConfigResponse {
  intervalMinutes: number;
  cronExpression: string;
  allowedIntervals: number[];
}

const BASE = "/translations/cron/config";

export const cronConfigService = {
  get: async (): Promise<CronConfigResponse> => {
    return apiGet<CronConfigResponse>(BASE);
  },
  update: async (intervalMinutes: number): Promise<CronConfigResponse> => {
    return apiPatch<CronConfigResponse>(BASE, { intervalMinutes });
  },
};

