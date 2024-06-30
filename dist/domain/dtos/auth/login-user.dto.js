"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDTO = void 0;
const regularExps_1 = require("../../../utils/regularExps");
class LoginUserDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    static create(object) {
        const { email, password } = object;
        if (!email)
            return ['Email es requerido'];
        if (!regularExps_1.regularExps.email.test(email))
            return ['Email no es válido'];
        if (!password)
            return ['Contraseña es requerida'];
        return [undefined, new LoginUserDTO(email, password)];
    }
}
exports.LoginUserDTO = LoginUserDTO;
