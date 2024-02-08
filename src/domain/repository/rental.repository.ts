import { RentalEntity } from '../entities/rental.entity';

export abstract class RentalRepository {
  abstract createRental(rental: RentalEntity): Promise<RentalEntity>;
  abstract getRental(id: string): Promise<RentalEntity | null>;
  abstract getRentals(): Promise<RentalEntity[]>;
  abstract getRentalsByDay(day: string, month: string, year: string): Promise<RentalEntity[]>;
  abstract getRentalsByMonth(month: string, year: string): Promise<RentalEntity[]>;
  abstract getRentalsByPeriod(starting: string, ending: string): Promise<RentalEntity[]>;
  abstract updateRental(id: string, rental: RentalEntity): Promise<RentalEntity | null>;
  abstract deactivateRental(id: string): Promise<void>;
}
