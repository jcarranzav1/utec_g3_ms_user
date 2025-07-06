// File: src/plugins/swagger.ts
import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import fastifySwagger, { FastifyStaticSwaggerOptions } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { getEnv } from "@config/env.config";
import { StageEnum } from "@config/const/enum";

const swaggerPlugin: FastifyPluginAsync = async (app) => {
  const { NODE_ENV } = getEnv();

  const indexPrefix = NODE_ENV === StageEnum.LOCAL ? "" : "/dev";
  const swaggerSpec = yaml.load(
    fs.readFileSync(
      path.join(path.resolve(process.cwd(), "swagger.yaml")),
      "utf8"
    )
  );

  app.register<FastifyStaticSwaggerOptions>(fastifySwagger, {
    mode: "static",
    specification: {
      document: swaggerSpec,
      baseDir: process.cwd(),
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/api/users/docs",
    indexPrefix,
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    baseDir: path.join(__dirname, "static"),
  });
};

export default fp(swaggerPlugin, {
  name: "swagger-plugin",
});
