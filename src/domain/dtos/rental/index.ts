import { IRental } from '../../../interfaces';

export class RentalDTO {
  private constructor(public params: IRental) { }

  static create(object: { [key: string]: any; }): [string?, RentalDTO?] {
    const { client, time, date, vehicle, payment, amount } = object;

    if (!client) return ['Nombre de cliente es requerido'];
    if (!time) return ['Tiempo es requerido'];
    if (!date) return ['Fecha es requerida'];
    if (!vehicle) return ['Vehículo es requerido'];
    if (!payment) return ['Tipo de pago es requerido'];
    if (!amount) return ['Monto es requerido'];

    return [undefined, new RentalDTO({ client, time, date, vehicle, payment, amount })];
  }

  static update(object: IRental): [string?, RentalDTO?] {
    const { _id, client, time, date, vehicle, payment, amount } = object;

    if (!_id) return ['ID de alquiler no es válido'];

    return [undefined, new RentalDTO({ _id, client, time, date, vehicle, payment, amount })];
  }
}
