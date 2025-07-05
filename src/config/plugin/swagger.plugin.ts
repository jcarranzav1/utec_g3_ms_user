import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export const swaggerPlugin = fp(async (app: FastifyInstance) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Users Service",
        description: "API para gestionar usuarios",
        version: "1.0.0",
      },
      servers: [{ url: "/dev/api", description: "Stage dev" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/api/users/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  await app.ready();
  app.swagger();
});
