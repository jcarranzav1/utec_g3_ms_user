import { injectable, inject } from "inversify";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { IUserService } from "@application/interfaces/user.interface";
import { SignUpDto, LoginDto, UpdateUserDto } from "@application/dto/user.dto";
import { UserEntity } from "@domain/entity/user";
import { UserRepository } from "@infrastructure/repository/user.repository";
import { TYPES } from "@config/inversify/types";
import { JwtResponse } from "@application/dto/jwt/token.response.dto";
import { getEnv } from "@src/config/env.config";
import { JwtPayloadDto } from "../dto/jwt/token.payload.dto";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: UserRepository
  ) {}

  async signUp(dto: SignUpDto): Promise<JwtResponse> {
    if (await this.userRepository.getByEmail(dto.email)) {
      throw new Error("Email ya en uso");
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const newUser = UserEntity.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      phone: dto.phone,
      address: dto.address,
    });
    await this.userRepository.create(newUser);

    const { JWT_SECRET } = getEnv();

    const jwtPayload: JwtPayloadDto = {
      user_id: newUser.user_id,
      email: newUser.email,
    };
    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "2h" });
    delete newUser.password;
    return { token };
  }

  async login(dto: LoginDto): Promise<{ token: string; user: UserEntity }> {
    const existingUser = await this.userRepository.getByEmail(dto.email);
    if (!existingUser) {
      throw new Error("Credenciales inválidas");
    }
    if (
      !existingUser.password ||
      !(await bcrypt.compare(dto.password, existingUser.password))
    ) {
      throw new Error("Credenciales inválidas");
    }
    const { JWT_SECRET } = getEnv();

    const jwtPayload: JwtPayloadDto = {
      user_id: existingUser.user_id,
      email: existingUser.email,
    };
    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "2h" });
    delete existingUser.password;
    return { token, user: existingUser };
  }

  async getUser(user_id: string): Promise<UserEntity> {
    const user = await this.userRepository.getById(user_id);
    if (!user) throw new Error("Usuario no encontrado");
    delete user.password;
    return user;
  }

  async updateUser(user_id: string, dto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.getById(user_id);
    if (!user) throw new Error("Usuario no encontrado");
    const updated = user.edit(dto);
    await this.userRepository.update(updated);
  }
}
