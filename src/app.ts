// src/app.ts
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "@infrastructure/routes/user.routes";
import "reflect-metadata";
import jwtPlugin from "@config/plugin/jwt-auth.plugin";
import swaggerPlugin from "@config/plugin/swagger.plugin";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(jwtPlugin);
  app.register(swaggerPlugin);

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
