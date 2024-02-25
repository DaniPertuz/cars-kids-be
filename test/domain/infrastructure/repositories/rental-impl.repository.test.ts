import { IPayment } from '../../../../src/interfaces';
import { RentalDatasource } from '../../../../src/domain/datasources/rental.datasource';
import { RentalEntity } from '../../../../src/domain/entities/rental.entity';
import { RentalRepositoryImpl } from '../../../../src/infrastructure/repositories/rental-impl.repository';

type MockRentalDatasource = RentalDatasource & {
  [key: string]: jest.Mock<any, any>;
};

describe('Rental repository implementation', () => {
  const mockRentalDatasource: MockRentalDatasource = {
    createRental: jest.fn(),
    getRental: jest.fn(),
    getRentals: jest.fn(),
    getRentalsByDay: jest.fn(),
    getRentalsByMonth: jest.fn(),
    getRentalsByPeriod: jest.fn(),
    updateRental: jest.fn(),
    deactivateRental: jest.fn()
  };

  const rentalRepositoryImpl = new RentalRepositoryImpl(mockRentalDatasource);

  const rental = new RentalEntity({
    client: 'Test Name',
    time: 15,
    date: '01-01-2020',
    vehicle: 'd3ba2daad17250e579833f0e',
    payment: IPayment.Cash,
    amount: 10000,
    user: 'd4ba2daad17250e579833f0e',
    exception: 'Test exception'
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { method: 'createRental', args: [rental], },
    { method: 'getRental', args: [rental] },
    { method: 'getRentals', args: [] },
    { method: 'getRentalsByDay', args: ['01', '01', '2020'] },
    { method: 'getRentalsByMonth', args: ['01', '2020'] },
    { method: 'getRentalsByPeriod', args: ['01-01-2020', '01-12-2020'] },
    { method: 'updateRental', args: ['d3ba2daad17250e579833f0e'] },
    { method: 'deactivateRental', args: ['d3ba2daad17250e579833f0e'] },
  ];

  testCases.forEach(({ method, args }) => {
    test(`should call ${method} on the datasource`, async () => {
      await (rentalRepositoryImpl as any)[method](...args);
      expect(mockRentalDatasource[method]).toHaveBeenCalled();
    });
  });
});
