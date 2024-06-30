"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeskRepositoryImpl = void 0;
class DeskRepositoryImpl {
    constructor(deskDatasource) {
        this.deskDatasource = deskDatasource;
    }
    createDesk(desk) {
        return this.deskDatasource.createDesk(desk);
    }
    getDesks(paginationDto) {
        return this.deskDatasource.getDesks(paginationDto);
    }
    getDesk(name) {
        return this.deskDatasource.getDesk(name);
    }
    updateDesk(name, desk) {
        return this.deskDatasource.updateDesk(name, desk);
    }
    deleteDesk(name) {
        return this.deskDatasource.deleteDesk(name);
    }
}
exports.DeskRepositoryImpl = DeskRepositoryImpl;
