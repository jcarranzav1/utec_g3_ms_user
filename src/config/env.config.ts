import { z } from "zod";
import * as dotenv from "dotenv";
import { StageEnum } from "./const/enum";

dotenv.config();

const envSchema = z.object({
  IAM_ROLE_ARN: z.string().optional(),
  REST_API_ID: z.string().min(1, "REST_API_ID is required"),
  REST_API_ROOT_RESOURCE_ID: z
    .string()
    .min(1, "REST_API_ROOT_RESOURCE_ID is required"),
  USERS_TABLE: z.string().min(1, "USERS_TABLE is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  STAGE: z.string().min(1, "STAGE is required").default(StageEnum.LOCAL),
});
export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) {
    return _env;
  }

  dotenv.config();

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
