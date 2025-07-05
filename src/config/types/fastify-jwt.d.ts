import "@fastify/jwt";

import type { JwtPayloadDto } from "./src/internal/application/dto/jwt/token.payload.dto";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: JwtPayloadDto;
  }
}
