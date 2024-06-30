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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const mongo_user_datasource_1 = require("../../infrastructure/datasources/mongo-user.datasource");
const user_impl_repository_1 = require("../../infrastructure/repositories/user-impl.repository");
const interfaces_1 = require("../../interfaces");
const user_1 = __importDefault(require("../../database/models/user"));
const pagination_dto_1 = require("../../domain/dtos/shared/pagination.dto");
class UsersController {
    constructor() {
        this.userRepo = new user_impl_repository_1.UserRepositoryImpl(new mongo_user_datasource_1.MongoUserDatasource());
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const users = yield this.userRepo.getUsers(paginationDto);
            const { page: productPage, limit: limitPage, total, next, prev, users: data } = users;
            return res.json({
                page: productPage,
                limit: limitPage,
                total,
                next,
                prev,
                users: data.map(user => user.params)
            });
        });
        this.updateUserName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, name } = req.body;
            const userDB = yield user_1.default.findOne({ email });
            if (!userDB)
                return res.status(404).json({ error: 'Usuario no encontrado' });
            const user = yield this.userRepo.updateUserName(email, name);
            return res.json(user === null || user === void 0 ? void 0 : user.params);
        });
        this.updateUserEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, newEmail } = req.body;
            const userDB = yield user_1.default.findOne({ email });
            if (!userDB)
                return res.status(404).json({ error: 'Usuario no encontrado' });
            const user = yield this.userRepo.updateUserEmail(email, newEmail);
            return res.json(user === null || user === void 0 ? void 0 : user.params);
        });
        this.updateUserImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, img } = req.body;
            const userDB = yield user_1.default.findOne({ email });
            if (!userDB)
                return res.status(404).json({ error: 'Usuario no encontrado' });
            const user = yield this.userRepo.updateUserImage(email, img);
            return res.json(user === null || user === void 0 ? void 0 : user.params);
        });
        this.updateUserPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const userDB = yield user_1.default.findOne({ email });
            if (!userDB)
                return res.status(404).json({ error: 'Usuario no encontrado' });
            const user = yield this.userRepo.updateUserPassword(email, password);
            return res.json(user === null || user === void 0 ? void 0 : user.params);
        });
        this.updateUserRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, role } = req.body;
            if (!(Object.values(interfaces_1.IUserRole).includes(role)))
                return res.status(400).json({ error: 'Rol de usuario no válido' });
            const user = yield this.userRepo.updateUserRole(email, role);
            return res.json(user === null || user === void 0 ? void 0 : user.params);
        });
        this.updateUserStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, status } = req.body;
            if (!(Object.values(interfaces_1.IStatus).includes(status)))
                return res.status(400).json({ error: 'Estado de usuario no válido' });
            const user = yield this.userRepo.updateUserStatus(email, status);
            return res.json(user === null || user === void 0 ? void 0 : user.params);
        });
        this.deactivateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const userDB = yield user_1.default.findOne({ email });
            if (!userDB)
                return res.status(404).json({ error: 'Usuario no encontrado' });
            this.userRepo.deactivateUser(email);
            return res.json({ status: interfaces_1.IStatus.Inactive });
        });
    }
}
exports.UsersController = UsersController;
