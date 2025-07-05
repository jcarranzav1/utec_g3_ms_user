import { HealthController } from "./../controller/health.controller";
import { FastifyInstance } from "fastify";
import { UserController } from "@infrastructure/controller/user.controller";
import { container } from "@src/config/inversify/container";
import { TYPES } from "@src/config/inversify/types";

export async function userRoutes(app: FastifyInstance) {
  const userController = container.get<UserController>(TYPES.UserController);
  const healthController = container.get<HealthController>(
    TYPES.HealthController
  );

  app.get("/users/health", healthController.health.bind(healthController));
  app.post("/users", userController.signUp.bind(userController));
  app.post("/users/login", userController.loginUser.bind(userController));
  app.get(
    "/users/profile",
    { preHandler: [app.authenticate] },
    userController.getUser.bind(userController)
  );
  app.patch(
    "/users/profile",
    { preHandler: [app.authenticate] },
    userController.updateUser.bind(userController)
  );
}
