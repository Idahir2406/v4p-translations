import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DEEPL_API_KEY: z.string().min(1),
  ENVIRONMENT: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().min(1),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_DATABASE: z.string().min(1),
  DB_INITIAL: z.string().min(1),
  BASE_URL: z.string().min(1),
  CRON_TOKEN: z.string().min(1),
});
export const envs = envSchema.parse(process.env);
