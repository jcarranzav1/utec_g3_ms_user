import { UserEntity } from "@domain/entity/user";
import { LoginDto, SignUpDto, UpdateUserDto } from "@application/dto/user.dto";
import { JwtResponse } from "../dto/jwt/token.response.dto";

export interface IUserService {
  signUp(dto: SignUpDto): Promise<JwtResponse>;
  login(dto: LoginDto): Promise<JwtResponse>;
  getUser(userId: string): Promise<UserEntity | null>;
  updateUser(userId: string, dto: UpdateUserDto): Promise<void>;
}
