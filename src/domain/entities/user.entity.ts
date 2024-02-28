import { IUser } from '../../interfaces';

export class UserEntity {
  constructor(public params: IUser) { }

  static fromObject = (object: IUser): UserEntity => {
    const { email, password, name, role, status } = object;
    const user = new UserEntity({ email, password, name, role, status });
    return user;
  };
}
