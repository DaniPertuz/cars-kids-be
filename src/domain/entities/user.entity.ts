import { IUser } from '../../interfaces';
import { regularExps } from '../../utils/regularExps';
import { CustomError } from '../errors';

export class UserEntity {
  constructor(public params: IUser) { }

  static fromObject = (object: IUser): UserEntity => {
    const { email, password, name, role, status } = object;

    if (!email) throw CustomError.badRequest('Email es requerido');
    if (!regularExps.email.test(email)) throw CustomError.badRequest('Email no es válido');
    if (!name) throw CustomError.badRequest('Nombre es requerido');
    if (!role) throw CustomError.badRequest('Rol es requerido');

    const userEntityParams: IUser = { email, password, name, role, status };
    const user = new UserEntity(userEntityParams);
    return user;
  };
}
