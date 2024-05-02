import { IDesk } from '../../interfaces';

export class DeskEntity {
  constructor(public params: IDesk) { }

  static fromObject = (object: IDesk): DeskEntity => {
    const { _id, name } = object;
    return new DeskEntity({ _id, name });
  };
}
