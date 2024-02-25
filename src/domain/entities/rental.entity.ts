import { IRental } from '../../interfaces';

export class RentalEntity {
  constructor(public params: IRental) { }

  static fromObject = (object: { [key: string]: any; }): RentalEntity => {
    const { _id, client, time, date, vehicle, payment, amount, user, exception } = object;
    const rentalEntityParams: IRental = { _id, client, time, date, vehicle, payment, amount, user, exception };
    const rentalEntity = new RentalEntity(rentalEntityParams);
    return rentalEntity;
  };
}
