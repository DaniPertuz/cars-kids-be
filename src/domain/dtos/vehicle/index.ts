import { IStatus, IVehicle } from '../../../interfaces';
import { VehicleRentalTime } from '../../../interfaces/index';

export class VehicleDTO {
  private constructor(public params: IVehicle) { }

  static create(object: { [key: string]: any; }): [string?, VehicleDTO?] {
    const { nickname, category, color, size, rentalInfo, status = IStatus.Active } = object;

    if (!nickname) return ['Apodo de vehículo es requerido'];
    if (!category) return ['Categoría de vehículo es requerida'];
    if (!color) return ['Color de vehículo es requerido'];
    if (!size) return ['Tamaño de vehículo es requerido'];
    if (rentalInfo && Array.isArray(rentalInfo)) {
      for (const info of rentalInfo) {
        if (!info.price) return ['Precio de alquiler de vehículo es requerido'];
        if (!info.time) return ['Tiempo de alquiler de vehículo es requerido'];
      }
    }

    return [undefined, new VehicleDTO({ nickname, category, color, size, rentalInfo, status })];
  }
}
