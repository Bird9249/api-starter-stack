import Session from "../../entities/session.entity";
import User from "../../entities/user.entity";

export default interface IAuthRepository {
  checkUser(email: string): Promise<User | void>;

  createSession(session: Session): Promise<void>;

  getSession(id: string): Promise<Session | void>;

  removeSession(id: string): Promise<void>;
}
