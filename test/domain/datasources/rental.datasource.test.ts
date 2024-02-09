import { RentalDatasource } from '../../../src/domain/datasources/rental.datasource';
import { RentalEntity } from '../../../src/domain/entities/rental.entity';

describe('Rental datasource', () => {
  class MockDatasource implements RentalDatasource {
    createRental(rental: RentalEntity): Promise<RentalEntity> {
      throw new Error('Method not implemented.');
    }
    getRental(id: string): Promise<RentalEntity | null> {
      throw new Error('Method not implemented.');
    }
    getRentals(): Promise<RentalEntity[]> {
      throw new Error('Method not implemented.');
    }
    getRentalsByDay(day: string, month: string, year: string): Promise<RentalEntity[]> {
      throw new Error('Method not implemented.');
    }
    getRentalsByMonth(month: string, year: string): Promise<RentalEntity[]> {
      throw new Error('Method not implemented.');
    }
    getRentalsByPeriod(starting: string, ending: string): Promise<RentalEntity[]> {
      throw new Error('Method not implemented.');
    }
    updateRental(id: string, rental: RentalEntity): Promise<RentalEntity | null> {
      throw new Error('Method not implemented.');
    }
    deactivateRental(id: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  test('should test the abstract User class', async () => {
    const mockDatasource = new MockDatasource();

    expect(mockDatasource).toBeInstanceOf(MockDatasource);
    expect(typeof mockDatasource.createRental).toBe('function');
    expect(typeof mockDatasource.getRental).toBe('function');
    expect(typeof mockDatasource.getRentals).toBe('function');
    expect(typeof mockDatasource.getRentalsByDay).toBe('function');
    expect(typeof mockDatasource.getRentalsByMonth).toBe('function');
    expect(typeof mockDatasource.getRentalsByPeriod).toBe('function');
    expect(typeof mockDatasource.updateRental).toBe('function');
    expect(typeof mockDatasource.deactivateRental).toBe('function');
  });
});
