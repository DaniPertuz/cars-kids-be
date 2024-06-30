"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalDTO = void 0;
const validators_1 = require("../../../plugins/validators");
class RentalDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { client, time, date, vehicle, payment, amount, user, desk } = object;
        if (!client)
            return ['Nombre de cliente es requerido'];
        if (!time)
            return ['Tiempo es requerido'];
        if (!date)
            return ['Fecha es requerida'];
        if (!vehicle)
            return ['Vehículo es requerido'];
        if (!payment)
            return ['Tipo de pago es requerido'];
        if (!amount)
            return ['Monto es requerido'];
        if (!user)
            return ['Usuario es requerido'];
        if (!desk)
            return ['Puesto de trabajo es requerido'];
        if (!validators_1.Validators.isMongoID(vehicle))
            return ['Invalid vehicle ID'];
        if (!validators_1.Validators.isMongoID(desk))
            return ['Invalid desk ID'];
        if (!validators_1.Validators.isMongoID(user))
            return ['Invalid User ID'];
        return [undefined, new RentalDTO({ client, time, date, vehicle, payment, amount, user, desk })];
    }
    static update(object) {
        const { _id, client, time, date, vehicle, payment, amount, user, desk } = object;
        if (!_id)
            return ['ID de alquiler no es válido'];
        return [undefined, new RentalDTO({ _id, client, time, date, vehicle, payment, amount, user, desk })];
    }
}
exports.RentalDTO = RentalDTO;
