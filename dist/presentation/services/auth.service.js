"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const models_1 = require("../../database/models");
const user_entity_1 = require("../../domain/entities/user.entity");
const errors_1 = require("../../domain/errors");
const plugins_1 = require("../../plugins");
class AuthService {
    constructor() {
        this.validateUser = (token) => __awaiter(this, void 0, void 0, function* () {
            const payload = yield plugins_1.JwtAdapter.validateToken(token);
            if (!payload)
                throw errors_1.CustomError.unauthorized('Token inválido');
            const { email } = payload;
            if (!email)
                throw errors_1.CustomError.unauthorized('No hay email en token');
            const user = yield models_1.UserModel.findOne({ email });
            if (!user)
                throw errors_1.CustomError.unauthorized('Email no existe');
            return true;
        });
    }
    registerUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield models_1.UserModel.findOne({ email: dto.params.email });
                if (userExists)
                    throw errors_1.CustomError.badRequest('Email ya existe');
                const user = new models_1.UserModel(dto.params);
                user.password = plugins_1.bcryptAdapter.hash(dto.params.password);
                yield user.save();
                const _a = user_entity_1.UserEntity.fromObject(user).params, { password } = _a, userEntity = __rest(_a, ["password"]);
                const token = yield plugins_1.JwtAdapter.generateJWT({ email: user.email });
                if (!token)
                    throw errors_1.CustomError.serverError('Error al generar JWT');
                return {
                    user: userEntity,
                    token
                };
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`${error}`);
            }
        });
    }
    login(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDB = yield models_1.UserModel.findOne({ email: dto.email });
            if (!userDB)
                throw errors_1.CustomError.badRequest('Email no existe');
            const isMatching = plugins_1.bcryptAdapter.compare(dto.password, userDB.password);
            if (!isMatching)
                throw errors_1.CustomError.badRequest('Contraseña incorrecta');
            const _a = user_entity_1.UserEntity.fromObject(userDB).params, { password } = _a, userEntity = __rest(_a, ["password"]);
            const token = yield plugins_1.JwtAdapter.generateJWT({ email: userDB.email });
            if (!token)
                throw errors_1.CustomError.serverError('Error al generar JWT');
            return {
                user: userEntity,
                token
            };
        });
    }
}
exports.AuthService = AuthService;
