import { IStatus, IVehicle } from '../../../interfaces';

export class VehicleDTO {
  private constructor(public params: IVehicle) { }

  static create(object: IVehicle): [string?, VehicleDTO?] {
    const { nickname, category, color, size } = object;

    if (!nickname) return ['Apodo de vehículo es requerido'];
    if (!category) return ['Categoría de vehículo es requerida'];
    if (!color) return ['Color de vehículo es requerido'];
    if (!size) return ['Tamaño de vehículo es requerido'];

    return [undefined, new VehicleDTO({ ...object, status: IStatus.Active })];
  }
}
