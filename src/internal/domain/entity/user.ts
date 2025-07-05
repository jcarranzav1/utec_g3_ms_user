import { v4 as uuidv4 } from "uuid";
import { StatusEnum, UserTypeEnum } from "../../../config/const/enum";

export type UpdateUserProps = Partial<
  Pick<UserEntity, "phone" | "name" | "address">
>;

export class UserEntity {
  user_id: string;
  name: string | undefined;
  email: string;
  password?: string;
  phone: string;
  address: string;
  status: StatusEnum;
  type: UserTypeEnum;
  created_at: string;
  updated_at: string;

  constructor(props?: Partial<UserEntity>) {
    if (props) {
      Object.assign(this, props);
    }
  }

  static create(data: Partial<UserEntity>): UserEntity {
    const entity = new UserEntity();
    Object.assign(entity, {
      user_id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: StatusEnum.ACTIVE,
      type: UserTypeEnum.CUSTOMER,
      ...data,
    });
    return entity;
  }

  editPassword(newPassword: string): UserEntity {
    const newEntity = new UserEntity();
    Object.assign(newEntity, this);

    newEntity.password = newPassword;
    newEntity.updated_at = new Date().toISOString();

    return newEntity;
  }

  edit(changes: UpdateUserProps): UserEntity {
    const newEntity = new UserEntity();
    Object.assign(newEntity, this, changes);

    newEntity.updated_at = new Date().toISOString();
    return newEntity;
  }
}
