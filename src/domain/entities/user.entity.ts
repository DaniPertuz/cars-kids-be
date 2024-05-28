import { IUser } from '../../interfaces';

export class UserEntity {
  constructor(public params: IUser) { }

  static fromObject = (object: IUser): UserEntity => {
    const { _id, email, password, name, img, role, status } = object;
    const user = new UserEntity({ _id, email, password, name, img, role, status });
    return user;
  };
}
