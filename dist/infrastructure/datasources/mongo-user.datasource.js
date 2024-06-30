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
exports.MongoUserDatasource = void 0;
const models_1 = require("../../database/models");
const user_entity_1 = require("../../domain/entities/user.entity");
const errors_1 = require("../../domain/errors");
const interfaces_1 = require("../../interfaces");
const plugins_1 = require("../../plugins");
class MongoUserDatasource {
    getUsers(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = paginationDto;
                const [total, users] = yield Promise.all([
                    models_1.UserModel.countDocuments({ role: interfaces_1.IUserRole.Editor }),
                    models_1.UserModel.find({ role: interfaces_1.IUserRole.Editor })
                        .select('-password')
                        .sort({ status: 1, name: 1, email: 1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                ]);
                return {
                    page,
                    limit,
                    total,
                    next: ((page * limit) < total) ? `/users?page=${(page + 1)}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/users?page=${(page - 1)}&limit=${limit}` : null,
                    users: users.map(user_entity_1.UserEntity.fromObject)
                };
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener usuarios: ${error}`);
            }
        });
    }
    updateUserName(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield models_1.UserModel.findOneAndUpdate({ email }, { name }, { new: true, projection: { password: 0 } });
                return userData ? user_entity_1.UserEntity.fromObject(userData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar nombre de usuario: ${error}`);
            }
        });
    }
    updateUserImage(email, img) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield models_1.UserModel.findOneAndUpdate({ email }, { img }, { new: true, projection: { password: 0 } });
                return userData ? user_entity_1.UserEntity.fromObject(userData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar imagen de usuario: ${error}`);
            }
        });
    }
    updateUserEmail(email, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield models_1.UserModel.findOneAndUpdate({ email }, { email: newEmail }, { new: true, projection: { password: 0 } });
                return userData ? user_entity_1.UserEntity.fromObject(userData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar email de usuario: ${error}`);
            }
        });
    }
    updateUserPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = plugins_1.bcryptAdapter.hash(password);
                const userData = yield models_1.UserModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true, projection: { password: 0 } });
                return userData ? user_entity_1.UserEntity.fromObject(userData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar contraseña de usuario: ${error}`);
            }
        });
    }
    updateUserRole(email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield models_1.UserModel.findOneAndUpdate({ email }, { role }, { new: true, projection: { password: 0 } });
                return userData ? user_entity_1.UserEntity.fromObject(userData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar rol de usuario: ${error}`);
            }
        });
    }
    updateUserStatus(email, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield models_1.UserModel.findOneAndUpdate({ email }, { status }, { new: true, projection: { password: 0 } });
                return userData ? user_entity_1.UserEntity.fromObject(userData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar estado de usuario: ${error}`);
            }
        });
    }
    deactivateUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield models_1.UserModel.findOneAndUpdate({ email }, { status: interfaces_1.IStatus.Inactive }, { new: true });
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al eliminar usuario: ${error}`);
            }
        });
    }
}
exports.MongoUserDatasource = MongoUserDatasource;
