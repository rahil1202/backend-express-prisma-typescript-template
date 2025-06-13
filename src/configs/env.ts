import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string().url().or(z.string().startsWith('sqlite://')),
  ACCESS_SECRET_KEY: z.string().min(10, 'ACCESS_SECRET_KEY is too short'),
  REFRESH_SECRET_KEY: z.string().min(10, 'REFRESH_SECRET_KEY is too short'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  EMAIL_USERNAME: z.string().email(),
  EMAIL_PASSWORD: z.string().min(6, 'EMAIL_PASSWORD must be at least 6 characters long'),
  EMAIL_HOST: z.string().min(4, 'EMAIL_HOST must be at least 4 characters long'),
  EMAIL_PORT: z.coerce.number(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid or missing environment variables:\n', parsed.error.issues);
  console.error(parsed.error.format());
  process.exit(1);
}

export const envConfig = parsed.data;
