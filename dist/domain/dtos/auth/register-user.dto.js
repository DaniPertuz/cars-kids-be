"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDTO = void 0;
const interfaces_1 = require("../../../interfaces");
const regularExps_1 = require("../../../utils/regularExps");
class RegisterUserDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { name, img, email, password, role, status = interfaces_1.IStatus.Active } = object;
        if (!email)
            return ['Email es requerido'];
        if (!regularExps_1.regularExps.email.test(email))
            return ['Email no es válido'];
        if (!password)
            return ['Contraseña es requerida'];
        if (!name)
            return ['Nombre es requerido'];
        if (!role)
            return ['Rol es requerido'];
        return [undefined, new RegisterUserDTO({ name, img, email, password, role, status })];
    }
}
exports.RegisterUserDTO = RegisterUserDTO;
