import { HealthController } from "./../../internal/infrastructure/controller/health.controller";
// src/inversify/inversify.config.ts
import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./types";
import { IUserService } from "@application/interfaces/user.interface";
import { UserService } from "@application/service/user.service";
import { UserController } from "@infrastructure/controller/user.controller";
import { UserRepository } from "@src/internal/infrastructure/repository/user.repository";
import { IUserRepository } from "@domain/ports/user.port";

const container = new Container();

// Bindings
container
  .bind<IUserService>(TYPES.IUserService)
  .to(UserService)
  .inSingletonScope();

container
  .bind<IUserRepository>(TYPES.IUserRepository)
  .to(UserRepository)
  .inSingletonScope();

container
  .bind<UserController>(TYPES.UserController)
  .to(UserController)
  .inSingletonScope();

container
  .bind<HealthController>(TYPES.HealthController)
  .to(HealthController)
  .inSingletonScope();

export { container };
