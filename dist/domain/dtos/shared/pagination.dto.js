"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
class PaginationDto {
    constructor(page, limit) {
        this.page = page;
        this.limit = limit;
    }
    static create(page = 1, limit = 5) {
        if (isNaN(page) || isNaN(limit))
            return ['Page y limit deben ser numéricos'];
        if (page <= 0)
            return ['Page debe ser mayor que 0'];
        if (limit <= 0)
            return ['Limit debe ser mayor que 0'];
        return [undefined, new PaginationDto(page, limit)];
    }
}
exports.PaginationDto = PaginationDto;
