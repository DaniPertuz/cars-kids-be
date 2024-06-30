"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const vehicleSchema = new mongoose_1.Schema({
    nickname: { type: String, required: true, unique: true },
    img: { type: String, required: false, default: '' },
    category: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String,
        enum: {
            values: ['S', 'M', 'L'],
            message: '{VALUE} no es un tamaño válido',
            default: 'M',
            required: true
        }
    },
    status: { type: String,
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} no es un estado válido',
            default: 'active',
            required: true
        }
    }
}, {
    timestamps: true,
    versionKey: false
});
const Vehicle = mongoose_1.default.models.Vehicle || (0, mongoose_1.model)('Vehicle', vehicleSchema);
exports.default = Vehicle;
