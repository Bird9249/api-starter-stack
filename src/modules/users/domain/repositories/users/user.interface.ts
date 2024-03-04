import User from "../../entities/user.entity";

export interface IUserRepository {
  create(entity: User): Promise<void>;

  checkDuplicate(email: string, id?: number): Promise<User | void>;

  getById(id: number): Promise<User | void>;

  update(entity: User): Promise<void>;

  remove(id?: number): Promise<void>;
}
