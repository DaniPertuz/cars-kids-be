"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleEntity = void 0;
class VehicleEntity {
    constructor(params) {
        this.params = params;
    }
}
exports.VehicleEntity = VehicleEntity;
VehicleEntity.fromObject = (object) => {
    const { _id, nickname, category, color, img, size, status } = object;
    return new VehicleEntity({ _id, nickname, category, color, img, size, status });
};
