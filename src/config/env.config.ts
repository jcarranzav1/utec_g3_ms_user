import { z } from "zod";
import * as dotenv from "dotenv";
import { StageEnum } from "./const/enum";

if (process.env.NODE_ENV !== StageEnum.PRODUCTION) {
  dotenv.config();
}

const envSchema = z.object({
  IAM_ROLE_ARN: z.string().optional(),
  REST_API_ID: z.string().min(1, "REST_API_ID is required"),
  REST_API_ROOT_RESOURCE_ID: z
    .string()
    .min(1, "REST_API_ROOT_RESOURCE_ID is required"),
  USERS_TABLE: z.string().min(1, "USERS_TABLE is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z.string().default(StageEnum.DEVELOP),
});
export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "❌ Environment variable validation error:",
      parsed.error.format()
    );
    throw new Error("Invalid environment variables");
  }

  _env = parsed.data;
  return _env;
}
