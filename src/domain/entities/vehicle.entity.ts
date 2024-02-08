import { IVehicle } from '../../interfaces';

export class VehicleEntity {
  constructor(public params: IVehicle) { }

  static fromObject = (object: IVehicle): VehicleEntity => {
    const { nickname, category, color, img, size, status } = object;
    return new VehicleEntity({ nickname, category, color, img, size, status });
  };
}
