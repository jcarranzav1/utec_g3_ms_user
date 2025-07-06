import Fastify from "fastify";
import { userRoutes } from "@infrastructure/routes/user.routes";
import "reflect-metadata";
import jwtPlugin from "@config/plugin/jwt-auth.plugin";
import { usersSwaggerPlugin } from "@config/plugin/users.swagger.plugin";
import { kpisSwaggerPlugin } from "@config/plugin/kpis.swagger.plugin";
import { ordersSwaggerPlugin } from "@config/plugin/orders.swagger.plugin";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(jwtPlugin);
  app.register(usersSwaggerPlugin, {});
  app.register(kpisSwaggerPlugin, {});
  app.register(ordersSwaggerPlugin, {});

  app.register(
    async (fastify) => {
      userRoutes(fastify);
    },
    { prefix: "/api" }
  );

  return app;
}
