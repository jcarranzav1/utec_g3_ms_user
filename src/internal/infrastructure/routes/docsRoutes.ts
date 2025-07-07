import { FastifyInstance } from "fastify";
import { SwaggerEnum } from '@config/const/enum'
import { getEnv } from '@config/env.config'

export async function swaggerRoutes(app: FastifyInstance) {
    const { CDN } = getEnv();
    const specs = Object.values(SwaggerEnum) as SwaggerEnum[];
    specs.forEach((name) => {
        app.get(`/docs/${name}`, (_, reply) =>
            reply.redirect(`${CDN}/swagger-ui/index.html?url=${name}`)
        );
    })
}
