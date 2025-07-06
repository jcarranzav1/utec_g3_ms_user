import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { getEnv } from "@config/env.config";

const jwtPlugin: FastifyPluginAsync = async (app) => {
  const { JWT_SECRET } = getEnv();

  app.register(fastifyJwt, {
    secret: JWT_SECRET,
    sign: {
      algorithm: "HS256",
      expiresIn: "2h",
    },
  });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });
};

export default fp(jwtPlugin, {
  name: "jwt-plugin",
});
