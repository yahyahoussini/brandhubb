import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_SENTRY_DSN: z.union([z.string().url(), z.string().length(0)]).optional(),
});

const source = typeof import.meta.env !== 'undefined' ? import.meta.env : process.env;

const env = envSchema.safeParse(source);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(env.error.format(), null, 4)
  );
  throw new Error("Invalid environment variables");
}

export const config = env.data;
