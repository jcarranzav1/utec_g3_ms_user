// src/app.ts
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "@infrastructure/routes/user.routes";
import "reflect-metadata";
import { getEnv } from "@config/env.config";
import fastifyJwt from "@fastify/jwt";
import path from "path";
import yaml from "js-yaml";
import fs from "fs";

import fastifySwagger, { FastifyStaticSwaggerOptions } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { StageEnum } from "./config/const/enum";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  const { JWT_SECRET, NODE_ENV } = getEnv();

  app.register(fastifyJwt, { secret: JWT_SECRET });

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );

  const indexPrefix = NODE_ENV === StageEnum.LOCAL ? "" : "/dev";
  const swaggerSpec = yaml.load(
    fs.readFileSync(path.join(__dirname, "..", "swagger.yaml"), "utf8")
  );

  app.register<FastifyStaticSwaggerOptions>(fastifySwagger, {
    mode: "static",
    specification: {
      document: swaggerSpec,
      baseDir: path.join(__dirname, ".."),
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/api/docs",
    indexPrefix,
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    baseDir: path.join(__dirname, "static"),
  });

  app.register(
    async (fastify) => {
      userRoutes(fastify);
    },
    { prefix: "/api" }
  );

  app.ready().then(() => {
    app.swagger();
  });

  return app;
}
