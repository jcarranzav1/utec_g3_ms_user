import { injectable } from "inversify";

import { Messages } from "@src/config/const/messages";
import { HealthResponse } from "@src/internal/application/dto/health.dto.response";
import { FastifyReply, FastifyRequest } from "fastify";

@injectable()
export class HealthController {
  constructor() {}

  health(_request: FastifyRequest, reply: FastifyReply) {
    const payload: ApiResponse<HealthResponse> = {
      message: Messages.success.health,
      data: {
        status: "Ok",
        timestamp: new Date().toISOString(),
      },
    };
    return reply.status(200).send(payload);
  }
}
