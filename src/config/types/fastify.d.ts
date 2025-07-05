import { JwtPayloadDto } from "./src/internal/application/dto/jwt/token.payload.dto";
import "fastify";
declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}
