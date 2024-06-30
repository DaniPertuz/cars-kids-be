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
exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const plugins_1 = require("../plugins");
mongoose_1.default.set('strictQuery', false);
const mongoConnection = {
    isConnected: 0
};
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoConnection.isConnected) {
        return;
    }
    if (mongoose_1.default.connections.length > 0) {
        mongoConnection.isConnected = mongoose_1.default.connections[0].readyState;
        if (mongoConnection.isConnected === 1) {
            return;
        }
        yield mongoose_1.default.disconnect();
    }
    yield mongoose_1.default.connect(plugins_1.envs.MONGO_URL || '');
    mongoConnection.isConnected = 1;
});
exports.connect = connect;
const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'development')
        return;
    if (mongoConnection.isConnected === 0)
        return;
    yield mongoose_1.default.disconnect();
    mongoConnection.isConnected = 0;
});
exports.disconnect = disconnect;
