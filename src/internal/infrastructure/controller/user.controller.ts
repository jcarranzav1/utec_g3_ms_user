import { JwtResponse } from "./../../application/dto/jwt/token.response.dto";
// src/infrastructure/controller/UserController.ts
import { injectable, inject } from "inversify";
import { FastifyRequest, FastifyReply } from "fastify";
import { TYPES } from "@config/inversify/types";
import { IUserService } from "@application/interfaces/user.interface";
import {
  signUpSchema,
  loginSchema,
  updateUserSchema,
  SignUpDto,
  LoginDto,
  UpdateUserDto,
} from "@application/dto/user.dto";
import { Messages } from "@src/config/const/messages";
import { Resource } from "@src/config/const/enum";
import { UserEntity } from "@src/internal/domain/entity/user";

@injectable()
export class UserController {
  constructor(@inject(TYPES.IUserService) private userService: IUserService) {}

  private handleValidation<T>(parseResult: any, reply: FastifyReply) {
    if (!parseResult.success) {
      reply.status(400).send({
        message: "Validation failed",
        data: parseResult.error.format(),
      });
      return null;
    }
    return parseResult.data as T;
  }

  async signUp(req: FastifyRequest, reply: FastifyReply) {
    const dto = this.handleValidation<SignUpDto>(
      signUpSchema.safeParse(req.body),
      reply
    );
    if (!dto) return;

    try {
      const { token } = await this.userService.signUp(dto);
      const payload: ApiResponse<JwtResponse> = {
        message: Messages.success.login(Resource.USER),
        data: { token },
      };
      return reply.status(201).send(payload);
    } catch (err: any) {
      const status = err.message === "Email ya en uso" ? 409 : 500;
      return reply.status(status).send({ message: err.message });
    }
  }

  async loginUser(req: FastifyRequest, reply: FastifyReply) {
    const dto = this.handleValidation<LoginDto>(
      loginSchema.safeParse(req.body),
      reply
    );
    if (!dto) return;

    try {
      const { token } = await this.userService.login(dto);
      const payload: ApiResponse<JwtResponse> = {
        message: Messages.success.login(Resource.USER),
        data: { token },
      };
      return reply.status(201).send(payload);
    } catch {
      return reply.status(401).send({ message: "Invalid credentials" });
    }
  }

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { user_id } = req.user;
      const user = await this.userService.getUser(user_id);

      const payload: ApiResponse<UserEntity> = {
        message: Messages.success.login(Resource.USER),
        data: user,
      };
      return reply.send(payload);
    } catch (err: any) {
      const status = err.message === "Usuario no encontrado" ? 404 : 500;
      return reply.status(status).send({ message: err.message });
    }
  }

  async updateUser(req: FastifyRequest, reply: FastifyReply) {
    const dto = this.handleValidation<UpdateUserDto>(
      updateUserSchema.safeParse(req.body),
      reply
    );
    if (!dto) return;

    try {
      const { user_id } = req.user;
      await this.userService.updateUser(user_id, dto);
      return reply.send({
        message: Messages.success.patch(Resource.USER),
        data: null,
      });
    } catch (err: any) {
      const status = err.message === "Usuario no encontrado" ? 404 : 500;
      return reply.status(status).send({ message: err.message });
    }
  }
}
