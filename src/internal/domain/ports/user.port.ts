// src/domain/ports/IUserRepository.ts

import { UserEntity } from "../entity/user";

export interface IUserRepository {
  create(user: UserEntity): Promise<void>;

  getByEmail(email: string): Promise<UserEntity | null>;

  getById(user_id: string): Promise<UserEntity | null>;

  update(user: UserEntity): Promise<void>;
}
