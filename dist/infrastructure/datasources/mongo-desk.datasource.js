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
exports.MongoDeskDatasource = void 0;
const models_1 = require("../../database/models");
const entities_1 = require("../../domain/entities");
const errors_1 = require("../../domain/errors");
class MongoDeskDatasource {
    createDesk(desk) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.DeskModel.create(desk.params);
                return entities_1.DeskEntity.fromObject(data);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al crear puesto de trabajo: ${error}`);
            }
        });
    }
    getDesks(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = paginationDto;
                const [total, desks] = yield Promise.all([
                    models_1.DeskModel.countDocuments({}),
                    models_1.DeskModel.find({})
                        .skip((page - 1) * limit)
                        .limit(limit)
                ]);
                return {
                    page,
                    limit,
                    total,
                    next: ((page * limit) < total) ? `/desks?page=${(page + 1)}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/desks?page=${(page - 1)}&limit=${limit}` : null,
                    desks: desks.map(entities_1.DeskEntity.fromObject)
                };
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener todos los puestos de trabajo: ${error}`);
            }
        });
    }
    getDesk(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deskData = yield models_1.DeskModel.findOne({ name });
                return deskData ? entities_1.DeskEntity.fromObject(deskData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener puesto de trabajo: ${error}`);
            }
        });
    }
    updateDesk(name, desk) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deskData = yield models_1.DeskModel.findOneAndUpdate({ name }, desk.params, { new: true });
                return deskData ? entities_1.DeskEntity.fromObject(deskData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar puesto de trabajo: ${error}`);
            }
        });
    }
    deleteDesk(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const desk = yield models_1.DeskModel.findOneAndDelete({ name }, { new: true });
                return desk ? entities_1.DeskEntity.fromObject(desk) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al eliminar puesto de trabajo: ${error}`);
            }
        });
    }
}
exports.MongoDeskDatasource = MongoDeskDatasource;
