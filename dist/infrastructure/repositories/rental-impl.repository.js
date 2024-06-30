"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRepositoryImpl = void 0;
class RentalRepositoryImpl {
    constructor(rentalDatasource) {
        this.rentalDatasource = rentalDatasource;
    }
    createRental(rental) {
        return this.rentalDatasource.createRental(rental);
    }
    getRental(id) {
        return this.rentalDatasource.getRental(id);
    }
    getRentals(paginationDto) {
        return this.rentalDatasource.getRentals(paginationDto);
    }
    getRentalsByDay(day, month, year, paginationDto) {
        return this.rentalDatasource.getRentalsByDay(day, month, year, paginationDto);
    }
    getRentalsByMonth(month, year, paginationDto) {
        return this.rentalDatasource.getRentalsByMonth(month, year, paginationDto);
    }
    getRentalsByPeriod(starting, ending, paginationDto) {
        return this.rentalDatasource.getRentalsByPeriod(starting, ending, paginationDto);
    }
    updateRental(id, rental) {
        return this.rentalDatasource.updateRental(id, rental);
    }
    deactivateRental(id) {
        return this.rentalDatasource.deactivateRental(id);
    }
}
exports.RentalRepositoryImpl = RentalRepositoryImpl;
