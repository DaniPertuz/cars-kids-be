import { IStatus, IUser } from '../../../interfaces';
import { regularExps } from '../../../utils/regularExps';

export class RegisterUserDTO {
  private constructor(public params: IUser) { }

  static create(object: IUser): [string?, RegisterUserDTO?] {
    const { name, email, password, role, status = IStatus.Active } = object;

    if (!email) return ['Email es requerido'];
    if (!regularExps.email.test(email)) return ['Email no es válido'];
    if (!password) return ['Contraseña es requerida'];
    if (!name) return ['Nombre es requerido'];
    if (!role) return ['Rol es requerido'];

    return [undefined, new RegisterUserDTO({ name, email, password, role, status })];
  }
}
