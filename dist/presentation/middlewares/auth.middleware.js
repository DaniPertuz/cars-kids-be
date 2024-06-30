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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const errors_1 = require("../../domain/errors");
const plugins_1 = require("../../plugins");
const user_entity_1 = require("../../domain/entities/user.entity");
const models_1 = require("../../database/models");
class AuthMiddleware {
    static validateJWT(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.header('Authorization');
            if (!authorization)
                return res.status(401).json({ error: 'No token provided' });
            if (!authorization.startsWith('Bearer '))
                return res.status(401).json({ error: 'Invalid Bearer token' });
            const token = authorization.split(' ').at(1) || '';
            try {
                const payload = yield plugins_1.JwtAdapter.validateToken(token);
                if (!payload)
                    return res.status(401).json({ error: 'Invalid token' });
                const user = yield models_1.UserModel.findOne({ email: payload.email });
                if (!user)
                    return res.json(401).json({ error: 'Invalid token - user' });
                req.body.user = user_entity_1.UserEntity.fromObject(user);
                next();
            }
            catch (error) {
                errors_1.CustomError.serverError(`Internal server error: ${error}`);
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
