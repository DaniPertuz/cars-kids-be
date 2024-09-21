import { IVehicle } from '../../interfaces';

export class VehicleEntity {
  constructor(public params: IVehicle) { }

  static fromObject = (object: IVehicle): VehicleEntity => {
    const { _id, nickname, category, color, img, size, rentalInfo, status } = object;
    return new VehicleEntity({ _id, nickname, category, color, img, size, rentalInfo, status });
  };
}
