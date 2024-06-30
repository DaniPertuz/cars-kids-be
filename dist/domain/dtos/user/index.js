"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
const regularExps_1 = require("../../../utils/regularExps");
class UserDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { email, password, name, img, role, status } = object;
        if (!email)
            return ['Email es requerido'];
        if (!password)
            return ['Contraseña es requerida'];
        if (!regularExps_1.regularExps.email.test(email))
            return ['Email no es válido'];
        if (!name)
            return ['Nombre es requerido'];
        if (!role)
            return ['Rol es requerido'];
        if (!status)
            return ['Estado es requerido'];
        return [undefined, new UserDTO({ email, password, name, img, role, status })];
    }
}
exports.UserDTO = UserDTO;
