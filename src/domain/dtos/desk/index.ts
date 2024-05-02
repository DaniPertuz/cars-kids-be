import { IDesk } from '../../../interfaces';

export class DeskDTO {
  private constructor(public params: IDesk) { }

  static create(object: { [key: string]: any; }): [string?, DeskDTO?] {
    const { name } = object;

    if (!name) return ['Nombre del puesto de trabajo es requerido'];

    return [undefined, new DeskDTO({ name })];
  }
}
