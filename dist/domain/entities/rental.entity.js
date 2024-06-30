"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalEntity = void 0;
class RentalEntity {
    constructor(params) {
        this.params = params;
    }
}
exports.RentalEntity = RentalEntity;
RentalEntity.fromObject = (object) => {
    const { _id, client, time, date, vehicle, payment, amount, user, desk, exception } = object;
    const rentalEntityParams = { _id, client, time, date, vehicle, payment, amount, user, desk, exception };
    const rentalEntity = new RentalEntity(rentalEntityParams);
    return rentalEntity;
};
