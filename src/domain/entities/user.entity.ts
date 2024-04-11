import { IUser } from '../../interfaces';

export class UserEntity {
  constructor(public params: IUser) { }

  static fromObject = (object: IUser): UserEntity => {
    const { email, password, name, img, role, status } = object;
    const user = new UserEntity({ email, password, name, img, role, status });
    return user;
  };
}
