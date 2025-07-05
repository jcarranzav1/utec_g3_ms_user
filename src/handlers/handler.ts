import awsLambdaFastify from "@fastify/aws-lambda";
import { buildApp } from "../app";
import { getEnv } from "@src/config/env.config";

getEnv();

const app = buildApp();

const proxy = awsLambdaFastify(app, { retainStage: false });

export const handler = proxy;
