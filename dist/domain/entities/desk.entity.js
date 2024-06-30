"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeskEntity = void 0;
class DeskEntity {
    constructor(params) {
        this.params = params;
    }
}
exports.DeskEntity = DeskEntity;
DeskEntity.fromObject = (object) => {
    const { _id, name } = object;
    return new DeskEntity({ _id, name });
};
