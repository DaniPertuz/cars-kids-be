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
exports.AuthController = void 0;
const register_user_dto_1 = require("../../domain/dtos/auth/register-user.dto");
const errors_1 = require("../../domain/errors");
const login_user_dto_1 = require("../../domain/dtos/auth/login-user.dto");
class AuthController {
    constructor(service) {
        this.service = service;
        this.handleError = (error, res) => {
            if (error instanceof errors_1.CustomError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        };
        this.registerUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, registerDto] = register_user_dto_1.RegisterUserDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            this.service.registerUser(registerDto)
                .then(user => res.json(user))
                .catch(error => this.handleError(error, res));
        });
        this.loginUser = (req, res) => {
            const [error, loginDto] = login_user_dto_1.LoginUserDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            this.service.login(loginDto)
                .then(user => res.json(user))
                .catch(error => this.handleError(error, res));
        };
    }
}
exports.AuthController = AuthController;
