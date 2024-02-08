import { regularExps } from '../../../utils/regularExps';

export class LoginUserDTO {
  private constructor(
    public email: string,
    public password: string
  ) { }

  static create(object: { [key: string]: any; }): [string?, LoginUserDTO?] {
    const { email, password } = object;

    if (!email) return ['Email es requerido'];
    if (!regularExps.email.test(email)) return ['Email no es válido'];
    if (!password) return ['Contraseña es requerida'];

    return [undefined, new LoginUserDTO(email, password)];
  }
}
