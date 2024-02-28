import { IUser } from '../../../interfaces';
import { regularExps } from '../../../utils/regularExps';

export class UserDTO {
  private constructor(public params: IUser) { }

  static create(object: { [key: string]: any; }): [string?, UserDTO?] {
    const { email, password, name, role, status } = object;

    if (!email) return ['Email es requerido'];
    if (!password) return ['Contraseña es requerida'];
    if (!regularExps.email.test(email)) return ['Email no es válido'];
    if (!name) return ['Nombre es requerido'];
    if (!role) return ['Rol es requerido'];
    if (!status) return ['Estado es requerido'];

    return [undefined, new UserDTO({ email, password, name, role, status })];
  }
}
