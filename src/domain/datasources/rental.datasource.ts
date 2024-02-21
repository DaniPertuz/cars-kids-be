import { PaginationDto } from '../dtos/shared/pagination.dto';
import { RentalEntity } from '../entities/rental.entity';
import { RentalQueryResult } from '../../interfaces';

export abstract class RentalDatasource {
  abstract createRental(rental: RentalEntity): Promise<RentalEntity>;
  abstract getRental(id: string): Promise<RentalEntity | null>;
  abstract getRentals(paginationDto: PaginationDto): Promise<RentalQueryResult>;
  abstract getRentalsByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<RentalQueryResult>;
  abstract getRentalsByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<RentalQueryResult>;
  abstract getRentalsByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<RentalQueryResult>;
  abstract updateRental(id: string, rental: RentalEntity): Promise<RentalEntity | null>;
  abstract deactivateRental(id: string): Promise<void>;
}
