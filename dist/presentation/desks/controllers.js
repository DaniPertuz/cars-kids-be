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
exports.DeskController = void 0;
const mongo_desk_datasource_1 = require("../../infrastructure/datasources/mongo-desk.datasource");
const desk_impl_repository_1 = require("../../infrastructure/repositories/desk-impl.repository");
const pagination_dto_1 = require("../../domain/dtos/shared/pagination.dto");
const desk_1 = require("../../domain/dtos/desk");
const entities_1 = require("../../domain/entities");
class DeskController {
    constructor() {
        this.deskRepo = new desk_impl_repository_1.DeskRepositoryImpl(new mongo_desk_datasource_1.MongoDeskDatasource());
        this.getDesks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const desks = yield this.deskRepo.getDesks(paginationDto);
            const { page: productPage, limit: limitPage, total, next, prev, desks: data } = desks;
            return res.json({
                page: productPage,
                limit: limitPage,
                total,
                next,
                prev,
                desks: data.map(desk => desk.params)
            });
        });
        this.getDesk = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const desk = yield this.deskRepo.getDesk(name);
            return (desk) ? res.json(desk.params) : res.status(404).json({ error: `No se encontró el puesto de trabajo ${name}` });
        });
        this.createDesk = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, deskDto] = desk_1.DeskDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const deskDB = yield this.deskRepo.getDesk(deskDto.params.name);
            if (deskDB)
                return res.status(400).json({ error: 'Ya existe puesto de trabajo con este nombre' });
            const deskData = entities_1.DeskEntity.fromObject(deskDto.params);
            const desk = (yield this.deskRepo.createDesk(deskData)).params;
            return res.json(desk);
        });
        this.updateDesk = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const { name: newName } = req.body;
            const deskDB = yield this.deskRepo.getDesk(name);
            if (!deskDB)
                return res.status(404).json({ error: 'Puesto de trabajo no encontrado' });
            const existingDesk = yield this.deskRepo.getDesk(newName);
            if (existingDesk)
                return res.status(404).json({ error: 'Ya existe un puesto de trabajo con este nombre' });
            const updatedDeskData = {
                name: newName
            };
            const updatedDeskEntity = entities_1.DeskEntity.fromObject(updatedDeskData);
            const updatedDesk = yield this.deskRepo.updateDesk(name, updatedDeskEntity);
            return res.json(updatedDesk.params);
        });
        this.deleteDesk = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const deskDB = yield this.deskRepo.getDesk(name);
            if (!deskDB)
                return res.status(404).json({ error: 'Puesto de trabajo no encontrado' });
            const desk = yield this.deskRepo.deleteDesk(name);
            return res.json(desk.params);
        });
    }
}
exports.DeskController = DeskController;
