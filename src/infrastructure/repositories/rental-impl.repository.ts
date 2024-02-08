import { RentalDatasource } from '../../domain/datasources/rental.datasource';
import { RentalEntity } from '../../domain/entities/rental.entity';
import { RentalRepository } from '../../domain/repository/rental.repository';

export class RentalRepositoryImpl implements RentalRepository {
  constructor(private readonly rentalDatasource: RentalDatasource) { }

  createRental(rental: RentalEntity): Promise<RentalEntity> {
    return this.rentalDatasource.createRental(rental);
  }

  getRental(id: string): Promise<RentalEntity | null> {
    return this.rentalDatasource.getRental(id);
  }

  getRentals(): Promise<RentalEntity[]> {
    return this.rentalDatasource.getRentals();
  }

  getRentalsByDay(day: string, month: string, year: string): Promise<RentalEntity[]> {
    return this.rentalDatasource.getRentalsByDay(day, month, year);
  }

  getRentalsByMonth(month: string, year: string): Promise<RentalEntity[]> {
    return this.rentalDatasource.getRentalsByMonth(month, year);
  }

  getRentalsByPeriod(starting: string, ending: string): Promise<RentalEntity[]> {
    return this.rentalDatasource.getRentalsByPeriod(starting, ending);
  }

  updateRental(id: string, rental: RentalEntity): Promise<RentalEntity | null> {
    return this.rentalDatasource.updateRental(id, rental);
  }

  deactivateRental(id: string): Promise<void> {
    return this.rentalDatasource.deactivateRental(id);
  }
}
