"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleDTO = void 0;
const interfaces_1 = require("../../../interfaces");
class VehicleDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { nickname, category, color, size, status = interfaces_1.IStatus.Active } = object;
        if (!nickname)
            return ['Apodo de vehículo es requerido'];
        if (!category)
            return ['Categoría de vehículo es requerida'];
        if (!color)
            return ['Color de vehículo es requerido'];
        if (!size)
            return ['Tamaño de vehículo es requerido'];
        return [undefined, new VehicleDTO({ nickname, category, color, size, status })];
    }
}
exports.VehicleDTO = VehicleDTO;
