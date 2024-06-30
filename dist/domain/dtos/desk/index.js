"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeskDTO = void 0;
class DeskDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { name } = object;
        if (!name)
            return ['Nombre del puesto de trabajo es requerido'];
        return [undefined, new DeskDTO({ name })];
    }
}
exports.DeskDTO = DeskDTO;
