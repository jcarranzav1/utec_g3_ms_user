import Fastify from "fastify";
import fastifyCors from '@fastify/cors';
import { userRoutes } from "@infrastructure/routes/userRoutes";
import "reflect-metadata";
import jwtPlugin from "@config/plugin/jwt-auth.plugin";
import { swaggerRoutes } from '@infrastructure/routes/docsRoutes'


export function buildApp() {
    const app = Fastify({
        logger: true,
    });
    app.register(fastifyCors, {
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        credentials: false,
    });
    app.register(jwtPlugin);

    app.register(
        async (fastify) => {
            await userRoutes(fastify);
            await swaggerRoutes(fastify)
        },
        { prefix: "/api" }
    );

    return app;
}
