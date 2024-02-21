import { RentalDatasource } from '../../domain/datasources/rental.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { RentalEntity } from '../../domain/entities/rental.entity';
import { RentalRepository } from '../../domain/repository/rental.repository';
import { RentalQueryResult } from '../../interfaces';

export class RentalRepositoryImpl implements RentalRepository {
  constructor(private readonly rentalDatasource: RentalDatasource) { }

  createRental(rental: RentalEntity): Promise<RentalEntity> {
    return this.rentalDatasource.createRental(rental);
  }

  getRental(id: string): Promise<RentalEntity | null> {
    return this.rentalDatasource.getRental(id);
  }

  getRentals(paginationDto: PaginationDto): Promise<RentalQueryResult> {
    return this.rentalDatasource.getRentals(paginationDto);
  }

  getRentalsByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<RentalQueryResult> {
    return this.rentalDatasource.getRentalsByDay(day, month, year, paginationDto);
  }

  getRentalsByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<RentalQueryResult> {
    return this.rentalDatasource.getRentalsByMonth(month, year, paginationDto);
  }

  getRentalsByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<RentalQueryResult> {
    return this.rentalDatasource.getRentalsByPeriod(starting, ending, paginationDto);
  }

  updateRental(id: string, rental: RentalEntity): Promise<RentalEntity | null> {
    return this.rentalDatasource.updateRental(id, rental);
  }

  deactivateRental(id: string): Promise<void> {
    return this.rentalDatasource.deactivateRental(id);
  }
}
