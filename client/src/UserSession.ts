import { WSConnection } from "./WSConnection";

export class UserSession {
  private static instance: UserSession;
  private CURRENT_USER: string = "";
  private USER_CONNECTION: WSConnection | null = null;
  private constructor() {}
  public static getInstance(): UserSession {
    if (!UserSession.instance) {
      UserSession.instance = new UserSession();
    }
    return this.instance;
  }
  set currentUser(user: string) {
    this.CURRENT_USER = user;
  }
  set connection(connection: WSConnection) {
    this.USER_CONNECTION = connection;
  }
  get currentUser() {
    return this.CURRENT_USER;
  }
  get connection(): WSConnection | null {
    return this.USER_CONNECTION;
  }
}
